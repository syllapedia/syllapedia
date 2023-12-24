from flask import Response
from gemini_api import gemini_chat_respond
from highlight import update_highlight
from bson.objectid import ObjectId
from database import db

courses = db["Courses"]

def chat_respond(user_id, course_id, question):
  try:
    txt = courses.find_one({"_id":ObjectId(course_id)})["syllabus"]["txt"]
    pdf = courses.find_one({"_id":ObjectId(course_id)})["syllabus"]["pdf"]
  except:
    return Response(status=404)

  try:
    response = gemini_chat_respond(question, txt)
    answer = response["answer"]
  except:
    return {"answer": "Answer Failed to Complete", "valid": False}

  try:
    sources = response["sources"]
    update_highlight(user_id, pdf, sources)
  except:
    return {"answer": "Sources Failed to Complete", "valid": False}

  return {"answer": answer, "valid": response["valid"]}
