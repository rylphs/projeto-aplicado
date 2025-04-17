import boto3

BUCKET_NAME = "anexos-app-demandas-nuvem"
    
def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    key = event["key"]
  
    response = s3_client.generate_presigned_url("get_object", Params={"Bucket": BUCKET_NAME , "Key": key}, ExpiresIn=3600)
    return {
        "statusCode": 200,  "message": response
    }