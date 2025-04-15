from database import Connection

SERVICO_COLLECTION = 'servicos'

class ServicoService(Connection):

    def __init__(self, client = None):
        super().__init__(SERVICO_COLLECTION, client)

    def list_all_servicos(self):
        return self.to_list(self.find_all())

