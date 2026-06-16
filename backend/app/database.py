# from app.database import client, db, funcionarios, produtos
import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "padaria")

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections
produtos = db["produtos"]
funcionarios = db["funcionarios"]
clientes = db["clientes"]
pedidos = db["pedidos"]

__all__ = ["client", "db", "produtos", "funcionarios", "clientes", "pedidos"]