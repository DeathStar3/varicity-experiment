#!/bin/bash

echo "Copying resources to analyse in tmpfs mount..."
cp -r /resources2/$1 /resources/

ant -buildfile /resources/$1/build.xml