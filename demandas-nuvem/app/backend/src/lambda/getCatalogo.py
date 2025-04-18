from catalogo import ServicoService
from usuario import AuthService
from api import success_msg, bad_request_msg


def lambda_handler(event, context):
    resource = "demandas"
    method = "GET"
    authService = AuthService()
    auth_data = authService.unauthorized(event, resource, method)
    if(not auth_data["authorized"]):
        return auth_data["error"]
    
    service = ServicoService()
    return success_msg(service.get_catalogo())