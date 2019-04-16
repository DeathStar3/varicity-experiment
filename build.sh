#!/bin/bash

input_args="$@"

if [ $# -eq 0 ]
then
    input_args=(sources-fetcher symfinder-core visualization)
fi

for param in ${input_args[@]}
do
    echo "Building $param"
    case "$param" in
        "sources-fetcher")
            docker build -f docker/SourcesFetcherDockerfile -t symfinder-sources_fetcher .
            ;;
        "symfinder-core")
            mvn clean install
            docker-compose -f symfinder-compose.yaml build
            ;;
        "symfinder-core_skip_tests")
            mvn clean install -DskipTests
            docker-compose -f symfinder-compose.yaml build
            ;;
        "symfinder")
            docker-compose -f symfinder-compose.yaml build
            ;;
        "visualization")
            docker-compose -f visualization-compose.yaml build
            ;;
    esac
done