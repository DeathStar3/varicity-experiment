#!/bin/bash

docker run -it -v $(pwd)/resources:/resources --user $(id -u):$(id -g) --rm symfinder-sources_fetcher
./rerun.sh
