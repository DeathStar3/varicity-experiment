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

export SOURCES_PACKAGE="$1"
export GRAPH_OUTPUT_PATH="$2"
export PROJECT_NAME="$3"


echo "Cleaning previous execution..."
docker-compose -f symfinder-compose.yaml down
docker-compose -f symfinder-compose.yaml up --abort-on-container-exit
docker-compose -f symfinder-compose.yaml down

