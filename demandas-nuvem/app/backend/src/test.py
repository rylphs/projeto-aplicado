from pprint import pprint
from core.usuario.usuario_service import UsuarioService
from core.demanda.demanda_service import DemandaService
from core.database.connection import Connection
from core.database.connection import clear_collection
from core.catalogo.catalogo_service import ServicoService
import json

service = ServicoService()


demandas = service.get_catalogo()

pprint(demandas)

# logged = service.login("rylphs@gmail.com", "teste55555")

# if logged: 
#     print("logado com senha errada")

# logged = service.login("rylphs@gmail.com", "teste")

# if logged: 
#     print("logado com sucesso", logged["token"])

# pprint(logged)    
#token = logged["token"]



#print(service.validate("rylphs@gmail.com", token))

# clear_collection("users")
# clear_collection("pwd")

#service.insert_user("Raphael", "rylphs@gmail.com", "GESTOR", thumb, "teste")
# passservice = Connection("pwd")

# pwds = passservice.find_all()
# for pwd in pwds:
#     pprint(pwd)

#clear_collection("pwd")


# pwds = list(service.find_all())
# print(json.dumps(service.list_all_users()))
# for pwd in pwds:
#     pprint(pwd)

#demandas = service.list_all_users()
#for demanda in demandas:
#    pprint(demanda)

# pprint(service.login("rylphs@gmail.com", "teste"))





