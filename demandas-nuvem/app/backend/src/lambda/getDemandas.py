from demanda import DemandaService
from usuario import AuthService
from api import bad_request_msg, unauthorized_msg, success_msg


def lambda_handler(event, context):
    resource = "demandas"
    method = "GET"
    authService = AuthService()
    auth_data = authService.unauthorized(event, resource, method)
    if(not auth_data["authorized"]):
        return auth_data["error"]
    
    service = DemandaService()
    return success_msg(service.list_all_demandas())