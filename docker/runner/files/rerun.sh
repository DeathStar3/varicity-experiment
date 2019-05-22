#!/bin/bash

set -e


create_directory(){
    if [[ ! -d "$1" ]]; then
        echo "Creating $1 directory"
        mkdir -p "$1"
    else
        echo "$1 directory already exists"
    fi
}

docker-compose -f symfinder-compose.yaml down
docker-compose -f symfinder-compose.yaml up --abort-on-container-exit
docker-compose -f symfinder-compose.yaml down
