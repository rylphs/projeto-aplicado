from database import Connection

SERVICO_COLLECTION = 'servicos'
CATALOGOS_COLLECTION = 'catalogo'

class ServicoService(Connection):

    def __init__(self, client = None):
        super().__init__(SERVICO_COLLECTION, client)

    def list_all_servicos(self):
        catalogo = self.get_catalogo()
        versao = catalogo["versao"]
        return self.to_list(self.find_many({"catalogo":versao}))
    
    def list_all_catalogos(self):
        catalogo_con = Connection(CATALOGOS_COLLECTION, self.client)
        return catalogo_con.to_list(catalogo_con.find_all())
    
    def get_servico(self, id):
        servico = self.find_one(id)
        servico["_id"] = str(servico["_id"])
        return servico
    
    def get_catalogo(self):
        catalogo_con = Connection(CATALOGOS_COLLECTION, self.client)
        catalogo = catalogo_con.find_last(filter={}, field="versao")
        catalogo["_id"] = str(catalogo["_id"])
        if catalogo:
            servicos = self.to_list(self.find_many({"catalogo":catalogo["versao"]}))
            catalogo["servicos"] = servicos
        return catalogo
    
    def atualizar_servico(self, servico):
        if not "_id" in servico:
            id = str(self.insert_one(servico).inserted_id)
            servico_db = self.find_one(id)
        else:
            id = servico.pop("_id")
            self.update_one(id, servico)
            servico_db = self.find_one(id)
        servico_db["_id"] = str(servico_db["_id"])
        return servico_db
    
    def remover_servico(self, id):
        self.delete_by_id(id)
        return True
    
    def criar_versao(self):
        catalogo_con = Connection(CATALOGOS_COLLECTION, self.client)
        ultimo_catalogo = self.get_catalogo()
        servicos = self.list_all_servicos()
        
        versao = ultimo_catalogo.pop("versao") + 1
        catalogo = {"versao": versao}
        catalogo_con.insert_one(catalogo)
        for servico in servicos:
            servico.pop("_id")
            servico["catalogo"] = versao
        self.insert_many(servicos)
        return self.get_catalogo()