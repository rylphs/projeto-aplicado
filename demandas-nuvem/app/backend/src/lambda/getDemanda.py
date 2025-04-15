from demanda import DemandaService
from usuario import AuthService
from api import bad_request_msg, unauthorized_msg, success_msg

def lambda_handler(event, context):
    if (not "payload" in event):
        return bad_request_msg("Dados insuficientes")
    
    payload = event["payload"]
    if "id" not in payload:
        return bad_request_msg("Necessário informar o id da demanda")
    
    id = payload["id"]
    service = DemandaService()
    return success_msg(service.get_demanda_by_id(id))