import json
from api import bad_request_msg, unauthorized_msg, success_msg
from usuario import UsuarioService, AuthService

def lambda_handler(event, context):
    if (not "payload" in event):
        return bad_request_msg("Dados insuficientes")
    
    resource = "usuarios"
    method = "PUT"
    authService = AuthService()
    auth_data = authService.unauthorized(event, resource, method)
    if(not auth_data["authorized"]):
        return auth_data["error"]
    
    payload = event['payload']
    service = UsuarioService()
    if "thumb" in payload:
        thumb = payload["thumb"]
    else: thumb = None
    if "senha" in payload:
        senha = payload["senha"]
    else:
        senha = None
    try:
        result = service.update_user(payload["email"], payload["nome"], payload["role"], thumb, senha)
    except Exception as error:
        return bad_request_msg(str(error))
    
    return success_msg(result)