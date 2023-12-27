import google.generativeai as genai
from database import db
import json

courses = db["Courses"]

def gemini_chat_respond(question, txt):
    prompt_parts = [
    """Using [%s], answer [%s].
    
    Format your response as a json in this format {"answer": string, "sources": string[]}.
    
    "answer" is your answer to the question. It should be succinct and helpful. It should only get information from the syllabus.
    
    "sources" is a list of strings that contains only characters that are direct quotes from the syllabus that support the answer.
    
    Split source strings if there is a new line or if there are any characters that are bulleted or in a list.
    
    """ % (txt, question)
    ]
    try:
        genai.configure(api_key="AIzaSyCbU8m8uacogSPwrcITcZEtw5ILxEA7v6w")
        model = genai.GenerativeModel(model_name="gemini-pro")
        content = model.generate_content(prompt_parts)
        response = json.loads(content.text)
        answer = response["answer"]
        sources = response["sources"]
        return {"answer": answer, "sources": sources, "valid": True}
    except:
        return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "valid": False}
