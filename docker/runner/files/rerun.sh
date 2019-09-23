#!/bin/bash
#
# This file is part of symfinder.
#
# symfinder is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# symfinder is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with symfinder. If not, see <http://www.gnu.org/licenses/>.
#
# Copyright 2018-2019 Johann Mortara <johann.mortara@univ-cotedazur.fr>
# Copyright 2018-2019 Xhevahire Tërnava <xhevahire.ternava@lip6.fr>
# Copyright 2018-2019 Philippe Collet <philippe.collet@univ-cotedazur.fr>
#

set -e

export COMPOSE_CONVERT_WINDOWS_PATHS=1
export SOURCES_PACKAGE="$1"
export GRAPH_OUTPUT_PATH="$2"
export PROJECT_NAME="$3"
export SYMFINDER_BUILD_IMAGE="$4"

CONTAINER_TO_WAIT=""

echo "Cleaning previous execution..."
docker-compose -f symfinder-compose.yaml down

if [[ ! -z "$4" ]]; then
#    docker-compose -f symfinder-compose.yaml build sonarqube-server symfinder-builder webhook-server
    docker-compose -f symfinder-compose.yaml up &
    CONTAINER_TO_WAIT="webhook-server"
else
    docker-compose -f symfinder-compose.yaml up symfinder neo4j &
    CONTAINER_TO_WAIT="symfinder"
fi

sleep 30

WAIT=$(docker wait ${CONTAINER_TO_WAIT})

until [[ "$WAIT" == "247" || "$WAIT" == "0" ]]; do
    WAIT=$(docker wait ${CONTAINER_TO_WAIT})
    echo "WAIT: $WAIT"
    sleep 5
done

docker-compose -f symfinder-compose.yaml down

