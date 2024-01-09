import google.generativeai as genai
from database import db
import json

courses = db["Courses"]

def gemini_chat_respond(question, txt):
    prompt_parts = [
    """
    You are an academic assistant, specialized in addressing questions specifically related to the current course. 
    Your responses are tailored to the course content and syllabus, and you provide sources from the course material. 
    You focus solely on assisting with course-related queries.

    Using [%s], answer [%s].

    Format your response as a json in this format {"answer": string, "sources": string[]}.

    "answer" is your answer to the question. It should be clear and helpful. It should only get information from the syllabus.

    "sources" is a list of strings that contains only characters that are direct quotes from the syllabus that support the answer.

    Split source strings if there is a new line or if there are any characters that are bulleted or in a list.

    """ % (txt, question)
    ]
    try:
        # Gets Gemini response
        genai.configure(api_key="AIzaSyCbU8m8uacogSPwrcITcZEtw5ILxEA7v6w")
        model = genai.GenerativeModel(model_name="gemini-pro")
        content = model.generate_content(prompt_parts)

        # Converts response into a json object
        response = json.loads(content.text)
        answer = response["answer"]
        sources = response["sources"]
        
        # Returns answer, sources, and whether response executed successfully
        return {"answer": answer, "sources": sources, "valid": True}
    except:
        return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "valid": False}
