from typing import Mapping
import pymongo
from bson import ObjectId

SERVER_ADDRESS = "34.236.14.200"
SERVER_PORT = 27017
USER = "paxpdbuser"
PWD = "tpnqmfFp4#13"
BASE_URL = f'mongodb://{USER}:{PWD}@{SERVER_ADDRESS}:{SERVER_PORT}'

DATABASE = "paxpdbdemandas"

def clear_collection(collection_name:str):
    client = pymongo.MongoClient(BASE_URL)
    client[DATABASE][collection_name].delete_many({})
    
def obj_id_to_string(result):
    result['_id'] = str(result['_id'])
    return result

class Connection:
    def __init__(self, col_name:str, client: pymongo.MongoClient = None):
        self.col_name = col_name
        if client:
            self.client = client
        else:
            self.client = pymongo.MongoClient(BASE_URL)
    
    def collection(self):
        return self.client[DATABASE][self.col_name]
    
    def to_list(self, result):
        result = list(result)
        for r in result: r['_id'] = str(r['_id'])
        return result
    
    def find_all(self):
        return self.collection().find()
    
    def find_one(self, id:str):
        return self.collection().find_one({"_id": ObjectId(id)})
    
    def find_first(self, filter: Mapping[str, any]):
        return self.collection().find_one(filter)
    
    def find_many(self, filter: Mapping[str, any]):
        return self.collection().find(filter)
    
    def insert_one(self, value):
        return self.collection().insert_one(value)
    
    def update_one(self, id:str, value: Mapping[str, any]):
        return self.collection().update_one({"_id": ObjectId(id)}, value)
    
    def replace_one(self, id:str, value: Mapping[str, any]):
        return self.collection().replace_one({"_id": ObjectId(id)}, value)
    
    def delete_by_id(self, id:str):
        return self.collection().delete_one({"_id": ObjectId(id)})
    
    def delete_many(self, filter: Mapping[str, any]):
        return self.collection().delete_many(filter)
    
    def close(self):
        return self.client.close()


