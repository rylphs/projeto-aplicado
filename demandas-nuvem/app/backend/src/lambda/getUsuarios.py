import json
from api import bad_request_msg, unauthorized_msg, success_msg
from usuario import UsuarioService

def lambda_handler(event, context):
    service = UsuarioService()
    return success_msg(service.list_all_users())