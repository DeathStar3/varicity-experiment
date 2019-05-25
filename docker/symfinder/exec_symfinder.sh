#!/bin/sh

set -e

java -jar /symfinder.jar /resources/"$1" "$2"

chown -R $SYMFINDER_UID:$SYMFINDER_GID /generated_visualizations