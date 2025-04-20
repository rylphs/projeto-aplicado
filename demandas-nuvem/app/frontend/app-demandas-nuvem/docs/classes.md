@startuml

class Usuario {
  nome: string
  email: string
}

Usuario --> "papel" PapelUsuario 

enum PapelUsuario {
  GESTOR
  RESPONSAVEL_TECNICO
  ADMIN
}

enum StatusDemanda {
  ABERTA
  EM_ATENDIMENTO
  ARQUITETURA_ELABORADA
}

class Demanda{
  demandante: string
  descricao: string
  gitIssue: Number
  anexos
}

Demanda --> Usuario: gestor
Demanda --> Usuario: tecnico
Demanda --> StatusDemanda: status

class Catalogo {
  versao
}

class Servico {
  nome
  label
  descricao
  camposResumo
}

class TipoCampo {
  tipo
  dominio
}

class Campo {
  nome
  label
  ajuda
  ordem
}

class InstanciaServico {
  resumo
}

class InstanciaCampo {
  valor
}

Catalogo *-- "*" Servico: servicos
Servico *-- "*" Campo: campos
Campo --> TipoCampo: tipo
InstanciaCampo --> Campo: metadado
InstanciaServico *-- "*" InstanciaCampo: campos
InstanciaServico --> Servico: metadado
Demanda *-- "*" InstanciaServico: dados


@enduml


**Estimativa da primeira entrega: final de março**

## Pendências Gerais
  - Definir V0
  - Cadastrar código de serviço
  - Avaliar integração com o GIA (Ver quem é o responsável)
  - Definir papéis
    - Gestor
    - Arquitetos

## Papeis
 - Mayra: PO
 - Alidon, Rodrigo, Raphael: Developer
 - Raphael: Scrum master

## Backlog

- Autenticação
	 - Decidir método de autenticação da V0 (Vai usar o gia?)
   - Não inclui cadastro de cliente

- Gerenciamento de serviços
	- Cadastro de serviços e campos
  - Não teria migração de catálogo

- Gerenciamento de demandas
  - Criar demanda
  - Tornar disponível
  - Editar demanda

- Gerenciamento de usuários
	- Cadastro de usuários, se aplicável e atribuição de papéis

- Preenchimento da demanda
	- Renderização dos campos dinâmicos
  - Gestão de status da demanda
	

	
	
## API
	- serviço
		- gerenciar definição de serviço
		- gerenciar catálogo
		
	- usuario
		- listar usuários
		- definir papel
		- cadastrar usuário?
		
	- demanda
		- gerenciar demanda
		- preencher demanda
		- listar demandas
			 - filtro por status, por responsável técnico, por gestor
