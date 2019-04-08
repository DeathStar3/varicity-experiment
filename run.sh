#!/bin/bash

docker-compose -f sources-fetcher-compose.yaml up
./rerun.sh
