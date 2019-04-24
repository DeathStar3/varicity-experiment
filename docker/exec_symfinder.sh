#!/bin/sh

set -e

echo "Copying resources to analyse in tmpfs mount..."
cp -r /resources2/$1 /resources
java -jar /symfinder.jar resources/$1 $2
