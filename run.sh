#!/bin/bash

docker run -it -v $(pwd)/resources:/resources --rm symfinder-sources_fetcher
./rerun.sh
