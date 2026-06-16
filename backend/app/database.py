import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dom_quixote")

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections da Pessoa 1
produtos = db["produtos"]
funcionarios = db["funcionarios"]
