import time
import random
from typing import List
from database import Connection
from datetime import timezone, datetime, timedelta
import jwt
import hashlib
from enum import Enum


USER_COLLECTION = 'users'
USER_PWD_COLLECTION = 'pwd'
USER_SESSION_COLLETION = "session"
EXPIRATION_TIME = timedelta(seconds=2)

class AuthService():
    
    def login(self, email:str, senha:str):
        user_connection = Connection(USER_COLLECTION)
        client = user_connection.client
        usuario = user_connection.find_first({"email": email})
        # Usuario não encontrado na base ou usuario desativado
        if not usuario or ("inativo" in usuario and usuario["inativo"]):
            return None
        
        # Converte ObjectId to MongoDB para string
        usuario["_id"] = str(usuario["_id"])
        
        if not self._password_matches(client, email, senha):
            return None
        
        token_data = self._generateToken(usuario)
        return self._create_session(client, usuario, token_data)
    
    def validate(self, email, token):
        session_connection = Connection(USER_SESSION_COLLETION)
        session_data = session_connection.find_first({"user_id", email})
        if not session_data:
            return None
        
        try:
            decoded = jwt.decode(token, session_data.secret, algorithms=["HS256"])
            return decoded
        except jwt.ExpiredSignatureError:
            # removendo sessao
            session_connection.delete_many({"user_id", email})
            return None
        except jwt.InvalidSignatureError:
            return None
    
    def _create_session(self, client, usuario, token_data):
        session_connection = Connection(USER_SESSION_COLLETION, client)
        session_connection.delete_many({"user_id": usuario["_id"]})
        session_data = {
            "user_id": usuario["_id"],
            "usuario": usuario,
            "token": token_data["token"],
            "secret": token_data["secret"]
        }
        session_connection.insert_one(session_data)
        session_data.pop("secret")
        session_data.pop("_id")
        #session_data["usuario"].pop("thumb")
        return session_data
    
    def _password_matches(self, client, email, senha):
        pwd_connection = Connection(USER_PWD_COLLECTION, client)
        db_hashed_pwd = pwd_connection.find_first({"user": email})
        hashed_pwd =  hashlib.sha224(senha.encode()).hexdigest()
        return (db_hashed_pwd != None) and ( hashed_pwd == db_hashed_pwd["pwd"])
    
    def _generateToken(self, usuario):
        hashInput = f'${int(time.time())}${usuario["_id"]}${random.randrange(100000)}'
        secret = hashlib.sha224(hashInput.encode()).hexdigest()
        expiration = datetime.now(tz=timezone.utc) + EXPIRATION_TIME
        token = jwt.encode({"usuario": usuario, "exp": expiration}, secret)
        return {"secret":secret, "token": token}
            
    