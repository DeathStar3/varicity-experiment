#!/bin/bash

create_directory(){
    if [[ ! -d "$1" ]]; then
        echo "Creating $1 directory"
        mkdir "$1"
    else
        echo "$1 directory already exists"
    fi
}

create_directory resources
create_directory generated_visualizations

docker run -it -v $(pwd)/resources:/resources -v $(pwd)/d3:/d3 -v $(pwd)/generated_visualizations:/generated_visualizations --user $(id -u):$(id -g) -e SYMFINDER_VERSION=$(git rev-parse --short=0 HEAD) --rm symfinder-sources_fetcher
./rerun.sh
