from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")

DATABASE_NAME = os.getenv("DATABASE_NAME")


client = MongoClient(MONGO_URI)


db = client[DATABASE_NAME]

# Collections
produtos = db["produtos"]
clientes = db["clientes"]
pedidos = db["pedidos"]
funcionarios = db["funcionarios"]