from typing import List

class Campo:
    def __init__(self, name:str, label:str, element:str, tipo:str):
        self.nome = name
        self.label = label
        self.element = element
        self.tipo = tipo

class Servico:
    
    def __init__(self, campos:List[Campo]):
        self.campos = campos     

class catalogo:
    def __init__(self, versao:int, campos:List[Servico]):
        self.versao = versao