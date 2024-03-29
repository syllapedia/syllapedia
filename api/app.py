from flask import jsonify
from apiflask import APIFlask
from flask_cors import CORS
from chatbot_api import chatbot_api
from user_api import user_api
from course_api import course_api
from graph_db_api import graph_db_api
from authorization import validate_key
from limiter import limiter

app = APIFlask(__name__)
app.register_blueprint(chatbot_api)
app.register_blueprint(user_api)
app.register_blueprint(course_api)
app.register_blueprint(graph_db_api)
CORS(app, origins=["http://localhost:3000", "https://www.syllapedia.com"], supports_credentials=True)
limiter.init_app(app)

@app.route("/")
@limiter.exempt
def status():
    # Returns a response indicating the server is running
    return jsonify({
        "authorized": validate_key(), 
        "status": "running"
        }), 200

if __name__ == "__main__":
    app.run()
