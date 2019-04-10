#!/bin/bash

docker-compose -f symfinder-compose.yaml up --abort-on-container-exit
docker-compose -f symfinder-compose.yaml stop

