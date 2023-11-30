from flask import jsonify
from apiflask import APIFlask
from flask_cors import CORS
from chatbot_api import chatbot_api
from user_api import user_api
from course_api import course_api

app = APIFlask(__name__)
app.register_blueprint(chatbot_api)
app.register_blueprint(user_api)
app.register_blueprint(course_api)
CORS(app)

@app.route("/")
def status():
    return jsonify({ 'status': 'running' }), 200

if __name__ == "__main__":
    app.run()