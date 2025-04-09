from typing import List
from database import Connection
import bcrypt
from datetime import timezone, datetime, timedelta
import jwt
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
        return self.find_all()

    def get_user_by_email(self, email):
        return self.find_first({"email": email})

    def insert_user(self, nome:str, email:str, roles:List[UserRoles], pwd):
        db_user = self.get_user_by_email(email)
        if(db_user):
            return db_user
        
        user = {"nome": nome, "email": email, "roles": roles}
        hash = self._get_hashed_password(pwd)
        pwdConnection = Connection(USER_PWD_COLLECTION, self.client)
        pwdConnection.insert_one({"user": email, "pwd": hash["pwd"], "salt": ["salt"]})
        print(f"insert user with pwd: {hash}")
        return self.insert_one(user)

    def update_roles(self, email: str, roles:List[UserRoles]):
        return self.update_one(email, {"roles": roles})
    
    def delete_user(self, email):
        return self.delete_by_id(email)

    def login(self, email, pwd):
        user = self.get_user_by_email(email)
        if not user:
            return None
        
        pwdConnection = Connection(USER_PWD_COLLECTION, self.client)
        db_hashed_pwd = pwdConnection.find_first({"user": email})
        
        logged = (db_hashed_pwd != None) and ( bcrypt.checkpw(pwd, db_hashed_pwd["pwd"]))
        if logged: 
            return self.__getToken(user['email'], db_hashed_pwd["pwd"])
        return None

    def __getToken(self, usuario, senha):
        expiration = datetime.now(tz=timezone.utc) + EXPIRATION_TIME
        print(expiration.isoformat())
        return jwt.encode({usuario: usuario, senha: senha, "exp": expiration}, SECRET)
    
    
    def _get_hashed_password(self, plain_text_password, salt = None):
        if not salt:
            salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(plain_text_password, salt)
        return {"salt":salt, "pwd": hash}

    def decode(self, token):
        try:
            decoded = jwt.decode(token, SECRET, algorithms=["HS256"])
            return decoded
        except jwt.ExpiredSignatureError:
            print("expired")



