import json
from api import bad_request_msg, success_msg
from catalogo import ServicoService
from usuario import AuthService

def lambda_handler(event, context):
    if (not "payload" in event):
        return bad_request_msg("Dados insuficientes")
    
    resource = "servico"
    method = "POST"
    authService = AuthService()
    auth_data = authService.unauthorized(event, resource, method)
    if(not auth_data["authorized"]):
        return auth_data["error"]
    
    payload = event['payload']
    service = ServicoService()
    
    try:
        result = service.atualizar_servico(payload)
    except Exception as error:
        return bad_request_msg(str(error))
    
    return success_msg(result)