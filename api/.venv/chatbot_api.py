from flask import request, jsonify
from apiflask import APIBlueprint
from chatbot_functions import chatRespond

chatbot_api = APIBlueprint("chatbot_api", __name__)

@chatbot_api.route("/chat", methods=["POST"])
def ask_question():
    data = request.get_json()

    chat_data = chatRespond(data["user_id"], data["course_id"], data["question"])

    return jsonify(chat_data), 200

@chatbot_api.route("/chat/debug", methods=["POST"])
def debug_chatgpt():
    data = request.get_json()

    chat_data = {"answer": f"user_id: {data["user_id"]}\ncourse_id: {data["course_id"]}\nquestion: {data["question"]}", "valid": True}

    return jsonify(chat_data)