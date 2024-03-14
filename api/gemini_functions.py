import google.generativeai as genai
from database import db
import json
from authorization import env_keys

courses = db["Courses"]

def gemini_chat_respond(context, query):
    prompt_parts = [f"Role: {env_keys["LLM_ROLE"]}\n\nInstructions: {env_keys["LLM_INSTRUCTIONS"]}\n\nContext: {context}\n\nQuery: {query}"]
    try:
        # Gets Gemini response
        genai.configure(api_key=env_keys['GOOGLE_API_KEY'])
        model = genai.GenerativeModel(model_name="gemini-pro")
        content = model.generate_content(prompt_parts)

        # Converts response into a json object
        response = json.loads(content.text)
        answer = response["answer"]
        sources = response["sources"]
        status = response["status"]
        
        # Returns answer, sources, and whether response executed successfully
        return {"answer": answer, "sources": sources, "status": status}
    except:
        return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "status": False}
