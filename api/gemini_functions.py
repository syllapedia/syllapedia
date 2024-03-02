import google.generativeai as genai
from database import db
import json
from authorization import env_keys

courses = db["Courses"]

def gemini_chat_respond(syllabus, query):
    prompt_parts = [f"Role: {env_keys["LLM_ROLE"]}\n\nInstructions: {env_keys["LLM_INSTRUCTIONS"]}\n\nSyllabus: {syllabus}\n\nQuery: {query}"]
    try:
        # Gets Gemini response
        genai.configure(api_key=env_keys['GOOGLE_API_KEY'])
        model = genai.GenerativeModel(model_name="gemini-pro")
        content = model.generate_content(prompt_parts)

        # Converts response into a json object
        response = json.loads(content.text)
        answer = response["answer"]
        sources = response["sources"]
        valid = len(sources) != 0
        
        # Returns answer, sources, and whether response executed successfully
        return {"answer": answer, "sources": sources, "valid": valid}
    except:
        return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "valid": False}
