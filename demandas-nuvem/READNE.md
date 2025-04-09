# Setup de ambiente

## Usuarios, grupos e permissionamento

* Criação dos grupos/usuários no IAM
  * arquitetos
  * developers


## Ambiente de Desenvolvimento

### AWS CLI
* Instalação

$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

* Configuração da chave de acesso
IAM -> Users -> Security Credentials -> Access Keys -> Create access Keys


* Configuracao da chave de acesso
Arquivo ~/.aws/credentials
[default]
aws_access_key_id = ***********
aws_secret_access_key = ***********


### Angular, Node e bibliotecas
* Node: Script disponível em: https://nodejs.org/en/download/
* Angular: npm install -g @angular/cli
* Angular Material: ng add @angular/material



* Definir metodo de deploy do frontend angular
  * ng build && aws cp file to bucket

### Backend AWS Lambda/Python
* Utilização de layers:
  * https://github.com/keithrozario/Klayers/tree/master/deployments/python3.12
  * https://docs.aws.amazon.com/lambda/latest/dg/python-layers.html


## Infraestrutura na Nuvem

## Banco de dados
* Criação da instância EC2
* Instalação do mongodb (https://medium.com/@pnle/install-standalone-mongodb-community-edition-on-aws-ec2-c3ced446370b)

* Criação do Bucket da aplicação: https://ricardo-mello.medium.com/como-criar-e-publicar-uma-aplica%C3%A7%C3%A3o-angular-no-amazon-s3-d850027c345e

* Configuração do API Gateway
* Configuração do cloudFront
* Criação da base no DocumentDB

