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
        return self.find_all()

    def get_demanda_by_id(self, id:str):
        return self.find_one(id)

    def insert_demanda(self, demanda: Demanda):
       return self.insert_one(demanda.serialize())

    def delete_demanda(self, id:str):
        self.delete_by_id(id)
        