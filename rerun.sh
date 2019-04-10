#!/bin/bash

export SYMFINDER_UID=$(id -u)
export SYMFINDER_GID=$(id -g)
docker-compose -f symfinder-compose.yaml up --abort-on-container-exit
docker-compose -f symfinder-compose.yaml stop

