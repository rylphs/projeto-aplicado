from typing import Dict
from database import Connection
from usuario.usuario_model import Usuario

DEMANDAS_COLLECTION = "demandas"

class Demanda:
    
    def __init__(self, descricao:str, demandante:str, issue:int, gestor: Usuario, responsavel: Usuario, valores: Dict[str, str] = []):
        self.descricao = descricao
        self.demandante = demandante
        self.issue = issue
        self.gestor = gestor
        self.responsavel = responsavel
        self.valores = valores
        
    def serialize(self):
        demanda = vars(self)
        demanda['gestor'] = self.gestor.email
        demanda['responsavel'] = self.responsavel.email
        return demanda
    
class DemandaService(Connection):
    
    def __init__(self, client = None):
        super().__init__(DEMANDAS_COLLECTION, client)
            
    def list_all_demandas(self):
        user_connection = Connection("users", self.client)
        usuarios = user_connection.to_list(user_connection.find_all())
        demandas = self.to_list(self.find_all())
        for demanda in demandas:
            gestor = next(filter(lambda u: u["email"] == demanda["gestor"], usuarios ), None)
            tecnico = next(filter(lambda u: u["email"] == demanda["tecnico"], usuarios ), None)
            if gestor:
                gestor["_id"] = str(gestor["_id"])
                demanda["gestor"] = gestor
            if tecnico:
                tecnico["_id"] = str(tecnico["_id"])
                demanda["tecnico"] = tecnico
        return demandas

    def get_demanda_by_id(self, id:str):
        return self.find_one(id)

    def insert_demanda(self, demanda: Demanda):
       data = self.insert_one(demanda)
       return str(data.inserted_id)

    def delete_demanda(self, id:str):
        self.delete_by_id(id)
        
    def update_demanda(self, demanda):
        if (not demanda or (not "_id" in demanda)):
            raise Exception("Parâmetros insuficientes")
        
        id = demanda.pop("_id")
        self.update_one(id, demanda)
            
        return True