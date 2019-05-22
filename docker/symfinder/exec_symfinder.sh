#!/bin/sh

set -e

echo $PWD
echo $DIR_PATH

java -jar /symfinder.jar /resources/$1 $2
