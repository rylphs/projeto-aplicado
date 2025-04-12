import json
from api import bad_request_msg, unauthorized_msg, success_msg
from demanda import DemandaService

def lambda_handler(event, context):
    if (not "payload" in event):
        return bad_request_msg("Dados insuficientes")
    
    payload = event['payload']
    service = DemandaService()
    try:
        result = service.insert_demanda(payload)
    except Exception as error:
        return bad_request_msg(str(error))
    
    return success_msg(result)