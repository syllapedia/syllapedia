from openai import OpenAI
from database import db
import json

courses = db["Courses"]

def create_completion_with_file(client, file, user_prompt):
    # Create the completion request
    completion = client.chat.completions.create(
        model="gpt-4",
        messages=[
            # Pre-response role
            {"role": "system", "content": "You are an academic assistant, specialized in addressing questions specifically related to the current course. Your responses are tailored to the course content and syllabus, and you provide sources from the course material. You focus solely on assisting with course-related queries."},
            
            # Syllabus
            {"role": "user", "content": file},
            
            # Question
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
    # Gets OpenAI response
    completion = create_completion_with_file(OpenAI(), txt, prompt)
    
    # Converts response into a json object
    response = json.loads(completion.choices[0].message.content)
    answer = response["answer"]
    sources = response["sources"]
    valid = len(sources) != 0
    
    # Returns answer, sources, and whether response executed successfully
    return {"answer": answer, "sources": sources, "valid": valid}
  except:
    return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "valid": False}

  
