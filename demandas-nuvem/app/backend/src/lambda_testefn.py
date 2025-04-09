from api import success_msg
from usuario import UsuarioService

def lambda_handler(event, context):
    service = UsuarioService()
    return success_msg("Teste de funcao publicada por script")