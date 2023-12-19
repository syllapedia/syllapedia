from openai import OpenAI
from database import db
import json

courses = db["Courses"]

def create_completion_with_file(client, file, user_prompt):
    # Create the completion request
    completion = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an academic assistant, specialized in addressing questions specifically related to the current course. Your responses are tailored to the course content and syllabus, and you provide sources from the course material. You focus solely on assisting with course-related queries."},
            {"role": "user", "content": file},
            {"role": "user", "content": user_prompt}
        ]
    )
    return completion

def openai_chat_respond(question, txt):
  prompt = """
  Using the uploaded syllabus, answer [%s]. 

  Format your response as a json in this format {"answer": string, "sources": string[]}. 

  "answer" is your answer to the question. It should be succinct and helpful.

  "sources" is a list of strings that are direct quotes from the given syllabus file that support the response. 

  Split source strings if there is a new line or if they are the contents of a list or bullet points.
  """ % (question)

  try:
    completion = create_completion_with_file(OpenAI(), txt, prompt)
    response = json.loads(completion.choices[0].message.content)
    answer = response["answer"]
    sources = response["sources"]
    return {"answer": answer, "sources": sources, "valid": True}
  except:
    return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "valid": False}

  
