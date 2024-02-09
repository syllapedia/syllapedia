from pymongo import MongoClient
from authorization import env_keys

client = MongoClient(env_keys["MONGODB_KEY"])
db = client["db"]
