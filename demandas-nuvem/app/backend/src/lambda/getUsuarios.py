import json
from api import success_msg
from usuario import UsuarioService

def lambda_handler(event, context):
    service = UsuarioService()
    return success_msg(service.list_all_users())