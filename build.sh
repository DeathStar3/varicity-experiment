#!/bin/bash

docker build -f docker/SourcesFetcherDockerfile -t symfinder-sources_fetcher .
docker-compose -f symfinder-compose.yaml build
docker-compose -f visualization-compose.yaml build