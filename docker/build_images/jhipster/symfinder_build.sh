#!/bin/bash

echo "Copying resources to analyse in tmpfs mount..."
cp -r /resources2/$1 /resources/

cd /resources/$1/jhipster-framework
mvn clean install -Dgpg.skip
