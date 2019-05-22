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

export SYMFINDER_UID=$(id -u)
export SYMFINDER_GID=$(id -g)

docker-compose -f symfinder-compose.yaml up --abort-on-container-exit
docker-compose -f symfinder-compose.yaml down

