import boto3
from api import success_msg



BUCKET_NAME = "anexos-app-demandas-nuvem"

def generate_url(file_name):
    s3_client = boto3.client("s3")
    return s3_client.generate_presigned_url('get_object', 
        Params= {"Bucket": BUCKET_NAME, "Key": file_name},     
            ExpiresIn=120)
    
def lambda_handler(event, context):
    filename = event['file']
    return success_msg(generate_url(filename))