#!/bin/bash

echo "Copying resources to analyse in tmpfs mount..."
cp -r /resources2/$1 /resources/

cd /resources/$1
mvn install:install-file -Dfile=lib/gpcj-2.2.0.jar -DgroupId=org.seisw -DartifactId=gpcj -Dversion=2.2.0 -Dpackaging=jar -Duser.home=/var/maven
mvn install -Duser.home=/var/maven