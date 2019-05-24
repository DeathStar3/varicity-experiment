#!/bin/sh

set -e

echo "ECHO"
echo "$1" "$2"

echo "ls /"
ls /

echo "ls /resources"
ls /resources

java -jar /symfinder.jar /resources/"$1" "$2"

chown -R $SYMFINDER_UID:$SYMFINDER_GID /generated_visualizations