#!/bin/bash

cd layers/libs/
zip -r libs.zip .
cd -
mv layers/libs/libs.zip .

rm -rf layers/core/python/*
cp -var src/core/* layers/core/python
find layers/core/python -name __pycache__ |xargs -Ixx rm -rf xx
cd layers/core
zip -r core.zip .
cd -
mv layers/core/core.zip .

