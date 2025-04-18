from catalogo import ServicoService
from usuario import AuthService
from api import bad_request_msg, success_msg


def lambda_handler(event, context):
    resource = "servicos"
    method = "GET"
    authService = AuthService()
    auth_data = authService.unauthorized(event, resource, method)
    if(not auth_data["authorized"]):
        return auth_data["error"]
    
    if not "id" in event:
        return bad_request_msg("Precisa fornecer o id do serviço")
    
    id = event["id"]
    service = ServicoService()
    return success_msg(service.get_servico(id))