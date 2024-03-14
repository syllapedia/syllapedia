from flask import Response, jsonify
from gemini_functions import gemini_chat_respond
from highlight import highlight_text_in_pdf
from bson.objectid import ObjectId
from database import db
from graph_db_functions import add_question_node, context_search

courses = db["Courses"]

def chat_respond(course_id, question):
  # Gets syllabus as string and pdf blob
  try:
    context = "\n\n".join(context_search(question, course_id))
    pdf = courses.find_one({"_id":ObjectId(course_id)})["syllabus"]["pdf"]
  except:
    return Response("Syllabus not found", 404)

  # Gets question answer and the answer's sources
  try:
    response = openai_chat_respond(context, question)
    answer = response["answer"]
  except:
    return Response("Answer failed to complete", 400)
  try:
    sources = response["sources"]
    highlight = highlight_text_in_pdf(pdf, sources)
  except:
    return Response("Sources failed to complete", 400)
  
  try:
    status = response["status"]
    if status in [200, 404]:
      add_question_node(question, course_id, 1 if status == 200 else 0)
  except:
    return Response("Status failure", 400)
  
  # Returns answer and its status
  return jsonify({"answer": answer, "status": status, "highlight": highlight}), 200
