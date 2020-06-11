#!/bin/bash

PROJECT_DIR="sat4j-22374e5e"

if [[ "$1" == "--local" ]]; then
    export TAG=local
    ./build.sh -DskipTests
else
    export TAG=latest
fi

./run.sh $@ sat4j

docker run -it -v $(pwd)/resources/$PROJECT_DIR:/project-sources -v $(pwd)/generated_visualizations/data/$PROJECT_DIR.json:/symfinder-json-output.json -v $(pwd)/selected_classes.txt:/selected_classes.txt --rm deathstar3/features-extractor:${TAG}
