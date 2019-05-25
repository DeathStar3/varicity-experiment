#!/bin/bash

docker build -f docker/sources_fetcher/SourcesFetcherDockerfile -t symfinder-sources_fetcher .
docker-compose -f symfinder-compose.yaml build --build-arg BUILD_PARAMS="$@"
docker-compose -f runner-compose.yaml build
docker-compose -f visualization-compose.yaml build