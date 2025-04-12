from demanda import DemandaService
from api import bad_request_msg, unauthorized_msg, success_msg


def lambda_handler(event, context):
    service = DemandaService()
    return success_msg(service.list_all_demandas())