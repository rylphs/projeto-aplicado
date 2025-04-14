import json
from api import bad_request_msg,  success_msg
from usuario import UsuarioService, AuthService

def lambda_handler(event, context):
    if (not "payload" in event):
        return bad_request_msg("Dados insuficientes")
    
    resource = "usuarios"
    method = "POST"
    authService = AuthService()
    auth_data = authService.unauthorized(event, resource, method)
    if(not auth_data["authorized"]):
        return auth_data["error"]
    
    payload = event['payload']
    service = UsuarioService()
    try:
        result = service.insert_user(payload["nome"], payload["email"], payload["role"], payload["senha"])
    except Exception as error:
        return bad_request_msg(str(error))
    
    return success_msg(result)