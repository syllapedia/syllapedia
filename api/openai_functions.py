from openai import OpenAI
from database import db
import json
from authorization import env_keys

courses = db["Courses"]

def create_completion_with_file(client, file, user_prompt):
    # Create the completion request
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            # Pre-response role
            {"role": "system", "content": env_keys["OPENAI_ROLE"]},
            
            # Syllabus
            {"role": "user", "content": file},
            
            # Question
            {"role": "user", "content": user_prompt}
        ]
    )
    return completion

def openai_chat_respond(question, txt):
  prompt = ("Using the uploaded syllabus, answer [%s].\n\n" % (question)) + env_keys["OPENAI_PROMPT"]

  try:
    # Gets OpenAI response
    completion = create_completion_with_file(OpenAI(api_key=env_keys['OPENAI_KEY']), txt, prompt)
    
    # Converts response into a json object
    response = json.loads(completion.choices[0].message.content)
    answer = response["answer"]
    sources = response["sources"]
    valid = len(sources) != 0
    
    # Returns answer, sources, and whether response executed successfully
    return {"answer": answer, "sources": sources, "valid": valid}
  except:
    return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "valid": False}

  
