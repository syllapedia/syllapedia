import requests
from flask import request, Response
from dotenv import load_dotenv
import os

# Load .env file and access all of its variables
load_dotenv()
env_keys = os.environ

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