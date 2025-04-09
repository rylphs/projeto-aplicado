def _msg(code, msg):
    return {
        'statusCode': code,
        'message': msg
    } 

def bad_request_msg(msg:str):
    return _msg(400, msg)
    
def success_msg(msg:str):
    return _msg(200, msg)
    
def unauthorized_msg(msg:str):
    return _msg(401, msg)

def forbidden_msg(msg:str):
    return _msg(403, msg)