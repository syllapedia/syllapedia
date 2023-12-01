from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient("mongodb+srv://apalabiyik:k1egQDy4x1GQHU0k@smartsyllabus.sxp4blm.mongodb.net/")
db = client["db"]
