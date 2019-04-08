#!/bin/bash

#mvn clean install
docker-compose -f sources-fetcher-compose.yaml build
docker-compose -f symfinder-compose.yaml build
docker-compose -f visualization-compose.yaml build