from catalogo import ServicoService
from usuario import AuthService
from api import bad_request_msg, unauthorized_msg, success_msg


def lambda_handler(event, context):
    service = ServicoService()
    return success_msg(service.list_all_servicos())