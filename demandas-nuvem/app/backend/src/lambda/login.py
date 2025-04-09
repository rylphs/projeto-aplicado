import json
from api import bad_request_msg, unauthorized_msg, success_msg
from usuario import UsuarioService

def lambda_handler(event, context):
    if (not "payload" in event) or (not "user" in event['payload']) or (not "pwd" in event['payload']):
        return bad_request_msg("Usuário e senha requeridos")
    
    payload = event['payload']
    service = UsuarioService()
    result = service.login(payload['user'], payload['pwd'])
    if not result:
        return unauthorized_msg("Autenticação falhou")
    return success_msg(result)