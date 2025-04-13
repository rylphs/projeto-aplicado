import json
from api import bad_request_msg, unauthorized_msg, success_msg
from demanda import DemandaService

def lambda_handler(event, context):
    if (not "payload" in event):
        return bad_request_msg("Dados insuficientes")
    
    payload = event['payload']
    service = DemandaService()
    try:
        service.delete_demanda(payload["_id"])
    except Exception as error:
        return bad_request_msg(repr(error))
    
    return success_msg(payload["_id"])