from flask import request, jsonify
from apiflask import APIBlueprint
from chatbot_functions import chat_respond
from authorization import authorize

chatbot_api = APIBlueprint("chatbot_api", __name__)

@chatbot_api.route("/chat", methods=["POST"])
def ask_question():
    def action():
        data = request.get_json()
        # Generates and returns a chat response
        return chat_respond(data["course_id"], data["question"])
    
    return authorize(action)

@chatbot_api.route("/chat/debug", methods=["POST"])
def debug_chat():
    def action():
        data = request.get_json()
        # Returns a standard output for /chat
        return jsonify(
            {"answer": f"user_id: {data["user_id"]}\ncourse_id: {data["course_id"]}\nquestion: {data["question"]}", "valid": True}
        ), 200
    
    return authorize(action)
