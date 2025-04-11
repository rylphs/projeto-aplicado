import json
from api import bad_request_msg, unauthorized_msg, success_msg
from usuario import UsuarioService

def lambda_handler(event, context):
    if (not "payload" in event):
        return bad_request_msg("Dados insuficientes")
    
    payload = event['payload']
    service = UsuarioService()
    try:
        service.delete_user(payload["email"])
    except Exception as error:
        return bad_request_msg(repr(error))
    
    return success_msg(payload["email"])