from typing import List
from database import Connection
from datetime import timezone, datetime, timedelta
import jwt
import hashlib
from enum import Enum

class UserRoles(Enum):
    GESTOR = "Gestor"
    RESPONSAVEL_TECNICO = "Responsável Técnico"
    
class Usuario:
    def __init__(self, nome, email, roles):
        self.nome = nome
        self.email = email,
        self.roles = roles
        pass
    
    def serialize(self):
        return self.email

USER_COLLECTION = 'users'
USER_PWD_COLLECTION = 'pwd'
EXPIRATION_TIME = timedelta(seconds=2)
# TODO Usar chave gerada na AWS
SECRET = "eyJSYXBoYWVsIjoiUmFwaGFlbCIsInNlbmhhIjoic2VuaGEiLCJleHAiOjE3NDExMjE2NjN9" 

class UsuarioService(Connection):

    def __init__(self, client = None):
        super().__init__(USER_COLLECTION, client)

    def list_all_users(self):
        return self.to_list(self.find_all())

    def get_user_by_email(self, email):
        return self.find_first({"email": email})

    def insert_user(self, nome:str, email:str, role:UserRoles, pwd):
        if (not email) or (not nome) or (not role) or (not pwd):
            raise Exception("Parâmetros insuficientes")
        
        db_user = self.get_user_by_email(email)
        if(db_user):
            raise Exception("Usuário Já existe no sistem")
        
        user = {"nome": nome, "email": email, "role": role, "inativo": False, "thumb": ""}
        hash = hashlib.sha224(pwd.encode()).hexdigest()
        pwdConnection = Connection(USER_PWD_COLLECTION, self.client)
        pwdConnection.insert_one({"user": email, "pwd": hash})
        print(f"insert user with pwd: {hash}")
        data = self.insert_one(user)
        return str(data.inserted_id)
    
    def update_user(self, email:str, nome:str, role:UserRoles = None, thumb = None, pwd = None):
        if (not email):
            raise Exception("Parâmetros insuficientes")
        user = self.get_user_by_email(email)
        id = user.pop("_id")
        if nome: user["nome"] = nome
        if role: user["role"] = role
        if thumb: user["thumb"] = thumb
        
        self.update_one(id, user)
        
        if pwd:
            hash = hashlib.sha224(pwd.encode()).hexdigest()
            pwdConnection = Connection(USER_PWD_COLLECTION, self.client)
            pwdEntry = pwdConnection.find_first({"user": email})
            pwdConnection.update_one(pwdEntry["_id"], {"user": email, "pwd": hash})
            
        user = self.get_user_by_email(email)
        user["_id"] = str(user["_id"])
            
        return user
        

    def update_roles(self, email: str, roles:List[UserRoles]):
        return self.update_one(email, {"roles": roles})
    
    def delete_user(self, email):
        if (not email):
            raise Exception("Parâmetros insuficientes")
        user = self.get_user_by_email(email)
        id = user.pop("_id")
        user["inativo"] = True
        self.update_one(id, user)
        return True


