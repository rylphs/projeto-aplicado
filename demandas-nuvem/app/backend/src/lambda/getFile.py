import boto3
from api import success_msg

BUCKET_NAME = "anexos-app-demandas-nuvem"

def exists(file_name):
    s3_client = boto3.client("s3")
    obj_list = s3_client.list_objects(
        Bucket=BUCKET_NAME, Prefix=file_name
    )
    return obj_list["MaxKeys"] > 0

def generate_url(file_name, default):
    s3_client = boto3.client("s3")
    file_exists = exists(file_name)
    if not file_exists:
        if default != None:
            file_name = default
        else: return None
            
    return s3_client.generate_presigned_url('get_object', 
        Params= {"Bucket": BUCKET_NAME, "Key": file_name},     
            ExpiresIn=120)
    
def lambda_handler(event, context):
    filename = event['file']
    if "default" in event:
        default = event["default"]
    else:
        default = None
    return success_msg(generate_url(filename))