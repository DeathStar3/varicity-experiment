#!/bin/bash

export SYMFINDER_UID=$(id -u)
export SYMFINDER_GID=$(id -g)
mvn clean install -DskipTests
docker build -f docker/SourcesFetcherDockerfile -t symfinder-sources_fetcher .
docker-compose -f symfinder-compose.yaml build
docker-compose -f visualization-compose.yaml build