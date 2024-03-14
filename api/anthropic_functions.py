import anthropic
from database import db
import json
from authorization import env_keys

courses = db["Courses"]

def create_completion_with_file(client, context, query):
    # Create the completion request
    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=1000,
        system=f"Role: {env_keys['LLM_ROLE']}\n\nInstructions: {env_keys['LLM_INSTRUCTIONS']}",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"Context: {context}\n\nQuery: {query}"
                    }
                ]
            }
        ]
    )
    return message.content[0].text

def claude_chat_respond(context, question):
  try:
    # Gets Claude response
    message = create_completion_with_file(anthropic.Anthropic(api_key=env_keys['ANTHROPIC_API_KEY']), context, question)
    # Converts response into a json object
    response = json.loads(message, strict=False)
    answer = response["answer"]
    sources = response["sources"]
    status = response["status"]
    
    # Returns answer, sources, and whether response executed successfully
    return {"answer": answer, "sources": sources, "status": status}
  except:
    return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "status": False}
