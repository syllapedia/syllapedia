from flask import Response, jsonify
from gemini_api import gemini_chat_respond
from highlight import update_highlight
from bson.objectid import ObjectId
from database import db

courses = db["Courses"]

def chat_respond(user_id, course_id, question):
  # Gets syllabus as string and pdf blob
  try:
    txt = courses.find_one({"_id":ObjectId(course_id)})["syllabus"]["txt"]
    pdf = courses.find_one({"_id":ObjectId(course_id)})["syllabus"]["pdf"]
  except:
    return Response("Syllabus not found", 404)

  # Gets question answer and the answer's sources
  try:
    response = gemini_chat_respond(question, txt)
    answer = response["answer"]
  except:
    return Response("Answer failed to complete", 400)
  try:
    sources = response["sources"]
    update_highlight(user_id, pdf, sources)
  except:
    return Response("Sources failed to complete", 400)

  # Returns answer and whether it is valid
  return jsonify({"answer": answer, "valid": response["valid"]}), 200
