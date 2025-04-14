import json
from api import success_msg
from usuario import UsuarioService, AuthService

def lambda_handler(event, context):
    resource = "usuarios"
    method = "GET"
    authService = AuthService()
    auth_data = authService.unauthorized(event, resource, method)
    if(not auth_data["authorized"]):
        return auth_data["error"]
    
    service = UsuarioService()
    return success_msg(service.list_all_users())