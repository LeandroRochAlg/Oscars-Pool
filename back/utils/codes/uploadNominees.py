import json
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from bson import ObjectId

load_dotenv("back/.env")

# Get the MongoDB URI from the environment
database = os.getenv("MONGODB_URI")

# Connect to MongoDB
client = MongoClient(database)
db = client['pool']
collection = db['nominees']

# Load JSON data from file
with open('back/utils/nominated/nominees.json') as file:
    data = json.load(file)

# Insert each object into the collection
for category in data:
    for nominee in category['nominees']:
        # Convert string movieId to ObjectId
        nominee['movieId'] = ObjectId(nominee['movieId'])
    collection.insert_one(category)

# Close the MongoDB connection
client.close()