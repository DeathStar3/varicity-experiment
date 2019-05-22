#!/bin/bash

set -e

export SYMFINDER_UID=$(id -u)
export SYMFINDER_GID=$(id -g)

docker-compose -f runner-compose.yaml up

