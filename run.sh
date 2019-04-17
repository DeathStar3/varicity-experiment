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

docker run -it -v $(pwd)/resources:/resources --user $(id -u):$(id -g) --rm symfinder-sources_fetcher
bash rerun.sh
