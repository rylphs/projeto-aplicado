from catalogo import ServicoService
from usuario import AuthService
from api import bad_request_msg, success_msg


def lambda_handler(event, context): 
    if not "id" in event:
        return bad_request_msg("Precisa fornecer o id do serviço")
    
    id = event["id"]
    service = ServicoService()
    return success_msg(service.get_servico(id))