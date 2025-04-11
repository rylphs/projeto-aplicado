import json
from api import bad_request_msg, unauthorized_msg, success_msg
from usuario import AuthService
import boto3



BUCKET_NAME = "anexos-app-demandas-nuvem"

def generate_url(file_name):
    s3_client = boto3.client("s3")
    return s3_client.generate_presigned_url('get_object', 
        Params= {"Bucket": BUCKET_NAME, "Key": file_name},     
            ExpiresIn=36000)

def lambda_handler(event, context):
    if (not "payload" in event) or (not "user" in event['payload']) or (not "pwd" in event['payload']):
        return bad_request_msg("Usuário e senha requeridos")
    
    payload = event['payload']
    service = AuthService()
    result = service.login(payload['user'], payload['pwd'])
    userid = result["user_id"]
    url = generate_url("user_thumbs/"+userid+".jpg")
    result["usuario"]["thumb"] = url
    if not result:
        return unauthorized_msg("Autenticação falhou")
    return success_msg(result)