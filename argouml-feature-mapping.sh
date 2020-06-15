#!/bin/bash

PROJECT_DIR="argoUML-bcae37308b13b7ee62da0867a77d21a0141a0f18"

if [[ "$1" == "--local" ]]; then
    export TAG=local
    ./build.sh -DskipTests
else
    export TAG=latest
fi

./run.sh $@ argoUML

docker run -it -v $(pwd)/generated_visualizations/data/$PROJECT_DIR.json:/symfinder-json-output.json --rm deathstar3/features-extractor-argouml:${TAG}
