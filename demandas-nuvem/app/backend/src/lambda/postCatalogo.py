import json
from api import bad_request_msg,  success_msg
from usuario import  AuthService
from catalogo import ServicoService

def lambda_handler(event, context):
    resource = "servicos"
    method = "POST"
    authService = AuthService()
    auth_data = authService.unauthorized(event, resource, method)
    if(not auth_data["authorized"]):
        return auth_data["error"]
    
    result = ServicoService().criar_versao()
    
    return success_msg(result)