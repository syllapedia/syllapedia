from openai import OpenAI
from database import db
import json
from authorization import env_keys

courses = db["Courses"]
client = OpenAI()

def create_completion_with_file(client, context, query):
    # Create the completion request
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": f"Role: {env_keys["LLM_ROLE"]}\n\nInstructions: {env_keys["LLM_INSTRUCTIONS"]}"},
            {"role": "user", "content": f"Context: {context}\n\nQuery: {query}"}
        ]
    )
    return completion

def openai_chat_respond(context, question):
  try:
    # Gets OpenAI response
    completion = create_completion_with_file(client, context, question)
    
    # Converts response into a json object
    response = json.loads(completion.choices[0].message.content)
    answer = response["answer"]
    sources = response["sources"]
    status = response["status"]
    
    # Returns answer, sources, and whether response executed successfully
    return {"answer": answer, "sources": sources, "status": status}
  except:
    return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "status": False}

  
