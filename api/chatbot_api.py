from flask import request, jsonify
from apiflask import APIBlueprint
from chatbot_functions import chat_respond

chatbot_api = APIBlueprint("chatbot_api", __name__)

@chatbot_api.route("/chat", methods=["POST"])
def ask_question():
    data = request.get_json()
    # Generates and returns a chat response
    return chat_respond(data["user_id"], data["course_id"], data["question"])

@chatbot_api.route("/chat/debug", methods=["POST"])
def debug_chat():
    data = request.get_json()
    # Returns a standard output for /chat
    return jsonify(
        {"answer": f"user_id: {data["user_id"]}\ncourse_id: {data["course_id"]}\nquestion: {data["question"]}", "valid": True}
    ), 200
