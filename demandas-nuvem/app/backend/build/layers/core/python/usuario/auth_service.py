import time
import random
from typing import List
from database import Connection
from datetime import timezone, datetime, timedelta
from api import unauthorized_msg
import jwt
import hashlib
from enum import Enum


USER_COLLECTION = 'users'
USER_PWD_COLLECTION = 'pwd'
USER_SESSION_COLLETION = "session"
EXPIRATION_TIME = timedelta(seconds=3600)

AUTH_MAP = {
    "usuarios": {
        "GET": ["ADMIN", "GESTOR", "TECNICO"],
        "PUT": ["ADMIN"],
        "DELETE": ["ADMIN"],
        "POST": ["ADMIN"]
    },
    "demandas": {
        "GET": ["ADMIN", "GESTOR", "TECNICO"],
        "PUT": ["GESTOR"],
        "DELETE": ["GESTOR"],
        "POST": ["GESTOR"]
    },
    "servicos": {
        "GET": ["ADMIN", "GESTOR", "TECNICO"],
        "POST": ["ADMIN", "GESTOR", "TECNICO"],
        "DELETE": ["ADMIN", "GESTOR", "TECNICO"]
    }
}

class AuthService():
    
    def get_auth_map(self):
        return AUTH_MAP
    
    def unauthorized(self, event, resource, method):
        auth_data ={
            "authorized": False,
            "usuario": None,
            "error": ""
        }
        if (not "token" in event):
            auth_data["authorized"] = False
            auth_data["error"] = unauthorized_msg("Token não forncecido")
            return auth_data
        
        token = event["token"]
        auth_data = self.validateToken(token)
        if(not auth_data["authorized"]):
            return auth_data
            
        usuario = auth_data["usuario"]
        if not self.isAllowed(usuario, resource, method):
            nome = usuario["nome"]
            auth_data["error"] = unauthorized_msg(f'Usuario {nome} não tem permissao {method} em {resource}')
            auth_data["authorized"] = False
            return auth_data
        
        auth_data["error"] = None
        auth_data["authorized"] = True
        return auth_data

    
    def isAllowed(self, usuario, resource, method):
        if(not usuario) or (not "role" in usuario):
            return False
        role = usuario["role"]
        
        role_required = None
        if (resource in AUTH_MAP) and method in AUTH_MAP[resource]:
            role_required = AUTH_MAP[resource][method]

        if not role_required:
            return True
        
        return role in role_required
    
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
    
    def validateToken(self, token):
        auth_data ={
            "authorized": False,
            "usuario": None,
            "error": ""
        }
        # Obtendo usuário do token
        claims = jwt.decode(token, options={"verify_signature": False})
        
        if(not "usuario" in claims) or (not "email" in claims["usuario"]):
            auth_data["error"] = unauthorized_msg("Sem usuário nos claims")
            return auth_data
                       
        email = claims["usuario"]["email"]
        
        session_connection = Connection(USER_SESSION_COLLETION)
        session_data = session_connection.find_first({"usuario.email": email})
        if not session_data:
            auth_data["error"] = unauthorized_msg("Nenhuma sessão ativa foi encontrada")
            return auth_data
        
        #try:
        decoded = jwt.decode(token, session_data["secret"], algorithms=["HS256"])
        auth_data["usuario"] = decoded["usuario"]
        auth_data["authorized"] = True
        return auth_data
        
        # except jwt.ExpiredSignatureError as e:
            
        #     # removendo sessao
        #     session_connection.delete_many({"user_id", email})
        #     auth_data["error"] = unauthorized_msg("Sessão Expirada")
        #     return auth_data
        # except jwt.InvalidSignatureError:
        #     auth_data["error"] = unauthorized_msg("Assinatura Inválida")
        #     return auth_data

    def _create_session(self, client, usuario, token_data):
        session_connection = Connection(USER_SESSION_COLLETION, client)
        session_connection.delete_many({"usuario.email": usuario["email"]})
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
            
    