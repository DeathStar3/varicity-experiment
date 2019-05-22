#!/bin/sh

set -e
echo "ls / symfinder"
ls /
java -jar /symfinder.jar /resources/$1 $2
