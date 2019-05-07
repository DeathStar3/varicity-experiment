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
create_directory resources
create_directory generated_visualizations/data
docker-compose -f symfinder-compose.yaml up #--abort-on-container-exit --exit-code-from webhook-server
docker-compose -f symfinder-compose.yaml stop

