#!/bin/sh

echo "Copying resources to analyse in tmpfs mount..."
cp -r /resources2/"$1" /resources/

SONAR_UP=$(curl -sS http://sonarqube-server:9000/api/system/status | jq -r .status)

until [[ "$SONAR_UP" == "UP" ]]; do
    SONAR_UP=$(curl -sS http://sonarqube-server:9000/api/system/status | jq -r .status)
    echo "SonarQube status: $SONAR_UP"
    sleep 5
done

echo "Creating webhook"

curl -s -u admin:admin -d "name=Report&url=http://webhook-server:8000/sonar_report" -X POST http://sonarqube-server:9000/api/webhooks/create

cd /resources/"$1"
mvn clean org.jacoco:jacoco-maven-plugin:0.8.3:prepare-agent install org.jacoco:jacoco-maven-plugin:0.8.3:report sonar:sonar -Dsonar.host.url=http://sonarqube-server:9000 -Dsonar.scm.disabled=True -Dsonar.projectKey="$1"
