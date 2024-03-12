from pymongo import MongoClient
from neo4j import GraphDatabase
from openai import OpenAI
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from authorization import env_keys

db = MongoClient(env_keys["MONGODB_KEY"])["db"]
graph_db = GraphDatabase.driver(env_keys["NEO4J_URI"], auth=(env_keys["NEO4J_USERNAME"], env_keys["NEO4J_PASSWORD"]))
client = OpenAI()
    