#!/bin/sh

set -e

mvn clean install -f /sources/pom.xml -DskipTests # -Dtest="*Test" -Duser.home=/var/maven

git clone https://github.com/junit-team/junit4 /resources
git --git-dir=/resources/.git --work-tree=/resources checkout tags/r4.12

mvn -f /sources/pom.xml exec:java -Dexec.mainClass=Main -Dexec.args="/resources/ /generated_test_visualizations/junit-r4.12.json" -Duser.home=/var/maven
mvn test -f /sources/pom.xml -Dtest="integration/**" -Duser.home=/var/maven
