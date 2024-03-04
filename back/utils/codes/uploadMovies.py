import json
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv("back/.env")

# Get the MongoDB URI from the environment
database = os.getenv("MONGODB_URI")

# Connect to MongoDB
client = MongoClient(database)
db = client['pool']
collection = db['movies']

# Load JSON data from file
with open('back/utils/nominated/movies.json') as file:
    data = json.load(file)

# Insert each object into the collection
for obj in data:
    collection.insert_one(obj)

# Close the MongoDB connection
client.close()