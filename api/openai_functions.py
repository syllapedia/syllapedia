from openai import OpenAI
from database import db
import json
from authorization import env_keys

courses = db["Courses"]

def create_completion_with_file(client, syllabus, query):
    # Create the completion request
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": f"Role: {env_keys["LLM_ROLE"]}\n\nInstructions: {env_keys["LLM_INSTRUCTIONS"]}"},
            {"role": "user", "content": f"Syllabus: {syllabus}\n\nQuery: {query}"}
        ]
    )
    return completion

def openai_chat_respond(txt, question):
  try:
    # Gets OpenAI response
    completion = create_completion_with_file(OpenAI(api_key=env_keys['OPENAI_API_KEY']), txt, question)
    
    # Converts response into a json object
    response = json.loads(completion.choices[0].message.content)
    answer = response["answer"]
    sources = response["sources"]
    valid = len(sources) != 0
    
    # Returns answer, sources, and whether response executed successfully
    return {"answer": answer, "sources": sources, "valid": valid}
  except:
    return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "valid": False}

  
