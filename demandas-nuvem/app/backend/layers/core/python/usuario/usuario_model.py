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
    
