from pymongo import MongoClient

uri = "mongodb+srv://enzomodenapro_db_user:dkifqjLti4h5kkbl@padaria.v7jgw8w.mongodb.net/?appName=padaria"

client = MongoClient(uri)

print(client.list_database_names())