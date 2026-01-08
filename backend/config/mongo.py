from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
print("🔌 Mongo URI being used:", MONGO_URI)

DB_NAME = os.getenv("DB_NAME", "banking_anomalies")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "transactions")

client = MongoClient(MONGO_URI)

# Select database and collection
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

def get_collection():
    """
    Returns the MongoDB collection.
    Used by all routes (upload, analytics, transactions).
    """
    return collection
