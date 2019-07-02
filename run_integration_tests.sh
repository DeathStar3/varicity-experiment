#!/bin/bash


export SYMFINDER_UID=$(id -u)
export SYMFINDER_GID=$(id -g)

docker-compose -f symfinder-test-compose.yaml build
docker-compose -f symfinder-test-compose.yaml up --abort-on-container-exit
docker-compose -f symfinder-test-compose.yaml down

