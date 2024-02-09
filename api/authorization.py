import requests
from flask import request, Response
from dotenv import load_dotenv
import os

# Load .env file and access all of its variables
load_dotenv()
env_keys = os.environ

# Correctly format chatbot strings in .env file
for key, value in env_keys.items():
    if key in ["GEMINI_ROLE", "GEMINI_PROMPT", "OPENAI_ROLE", "OPENAI_PROMPT"]:
        env_keys[key] = value.replace("^", "\n").replace("`", "\"")

def validate_key():
    # Authorization Header should be present
    if not ('Authorization' in request.headers.keys()):
        return False

    # Get the json web token
    jwt = request.headers['Authorization']

    # Isolate only the token
    start_index = request.headers['Authorization'].find('Bearer ') + len('Bearer ')
    jwt = jwt[start_index:]

    # Validate the key with google
    google_res = requests.post('https://oauth2.googleapis.com/tokeninfo?id_token=' + jwt)
    
    return 'email_verified' in google_res.json().keys()

def authorize(action):
    if validate_key():
        return action()
    else:
        return Response("Authorization Denied", 401)