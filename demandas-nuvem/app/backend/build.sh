#!/bin/bash

BUILD_DIR="build";
FUNCTIONS_DIR="$BUILD_DIR/functions";
LAYERS_DIR="$BUILD_DIR/layers/core";
SRC_DIR="src";
CORE_DIR="$SRC_DIR/core";
REGION=us-east-2

# Lib layers
bcrypt="arn:aws:lambda:us-east-2:770693421928:layer:Klayers-p312-bcrypt:5"
pymongo="arn:aws:lambda:us-east-2:770693421928:layer:Klayers-p312-pymongo:3"
jwt="arn:aws:lambda:us-east-2:717279735112:layer:PyJWT:2"

echo "Limpando $BUILD_DIR..."
rm -rf $BUILD_DIR;
mkdir -p $FUNCTIONS_DIR;
mkdir -p $LAYERS_DIR/python;

# Core Layer
echo "Publicando core layer..."
cp -var $CORE_DIR/* $LAYERS_DIR/python
find $LAYERS_DIR/python -name __pycache__ | xargs -Ixx rm -rf xx
cd $LAYERS_DIR
zip -r core.zip .
 core_layer_arn=$(aws lambda publish-layer-version --layer-name core \
     --description "Core Layer" \
     --zip-file fileb://core.zip \
     --compatible-runtimes python3.10 python3.11 python3.12 python3.13 \
     --compatible-architectures "x86_64" \
     --region $REGION | grep "LayerVersionArn" | grep -o 'arn:[^"]*')

echo "Core layer publicado $core_layer_arn"
cd -

echo "Verificando funções a publicar..."

function_files=$(find ./src/lambda -iname '*.py');
echo funcoes "$function_files"

for path in $function_files; do
    file=$(echo $path | cut -d '/' -f4)
    fname=$(echo $file | sed -r 's/.py$//')
    echo "Publicando arquivo $path ($file) com o nome $fname...";
   
    zipfile="$FUNCTIONS_DIR/$fname.zip";
    (cd $SRC_DIR/lambda && zip "../../$zipfile" $file)

    function_arn=$(aws lambda get-function \
            --region $REGION --function-name $fname 2> /dev/null | 
            grep "FunctionArn" | grep -o 'arn:[^"]*')
    
    if [ "${function_arn}Z" == "Z" ]; then 
        echo "Função $fname não existe, criando...";
        function_arn=$(aws lambda create-function \
        --region $REGION \
        --function-name $fname \
        --zip-file fileb://$zipfile \
        --handler $fname.lambda_handler \
        --runtime python3.12 \
        --role "arn:aws:iam::717279735112:role/LambdaRole" \
        --layers $bcrypt $pymongo $jwt $core_layer_arn > /dev/null | grep "FunctionArn" | grep -o 'arn:[^"]*');
        echo "Funcao Criada $function_arn";
        
    else
        echo "Atualizando função $fname : $function_arn"
        aws lambda update-function-code --function-name $function_arn --region $REGION \
            --zip-file fileb://$zipfile > /dev/null

        #Espera autliazação do código antes de atualizar layers
        state="pending"
        while [ $state != "Active" ]; do
            state="$(aws lambda get-function --function-name $function_arn --region us-east-2 --query 'Configuration.[State]'|grep -o "[a-zA-Z]*")"
        done;

        aws lambda update-function-configuration --function-name $function_arn --region $REGION \
            --layers $bcrypt $pymongo $jwt $core_layer_arn  > /dev/null
 
    fi
done;

echo "Pronto"