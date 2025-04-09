#!/bin/bash
ng build
aws s3 sync dist/app-demandas-nuvem/browser s3://app-demandas-nuvem
