import json
from api import bad_request_msg, unauthorized_msg, success_msg
from demanda import DemandaService
from usuario import AuthService

def lambda_handler(event, context):
    if (not "payload" in event):
        return bad_request_msg("Dados insuficientes")
    
    resource = "demandas"
    method = "DELETE"
    authService = AuthService()
    auth_data = authService.unauthorized(event, resource, method)
    if(not auth_data["authorized"]):
        return auth_data["error"]

    payload = event['payload']
    service = DemandaService()
    try:
        service.delete_demanda(payload["_id"])
    except Exception as error:
        return bad_request_msg(repr(error))
    
    return success_msg(payload["_id"])