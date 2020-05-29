#!/bin/bash

PROJECT_DIR="sat4j-42a72c20d4371a4d240d6ea85a5ec3a8265c3585"

if [[ "$1" == "--local" ]]; then
    export TAG=local
    ./build.sh -DskipTests
else
    export TAG=latest
fi

./run.sh $@ sat4j

docker run -it -v $(pwd)/resources/$PROJECT_DIR:/project-sources -v $(pwd)/generated_visualizations/data/$PROJECT_DIR.json:/symfinder-json-output.json --rm deathstar3/features-extractor:${TAG}
