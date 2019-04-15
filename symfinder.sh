#!/bin/bash

export SYMFINDER_UID=$(id -u)
export SYMFINDER_GID=$(id -g)

case "$1" in
	"build")
	    bash build.sh ${@:2}
        ;;
	"run")
    	bash run.sh
        ;;
    "rerun")
    	bash rerun.sh
        ;;
    "visualization")
    	bash visualization.sh
        ;;
    "down")
        docker-compose -f symfinder-compose.yaml down
        docker-compose -f visualization-compose.yaml down
        ;;
esac