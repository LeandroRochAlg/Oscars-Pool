import pymongo
import json
from bson import ObjectId
from dotenv import load_dotenv
import os

load_dotenv("back/.env")

database = os.getenv("MONGODB_URI")

# Convert ObjectId to string
def my_default(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

# Connect to MongoDB
client = pymongo.MongoClient(database)

db = client["pool"]
collection = db["movies"]

# Returns all documents in the collection
documents = collection.find()

# Save the documents in a JSON file
movies = list(documents)
with open("back/utils/nominated/moviesdb.json", "w") as file:
    json.dump(movies, file, default=my_default, indent=4)

# Close the MongoDB connection
client.close()