#!/bin/sh

set -e

sh findfeatures.sh /project-sources/org.sat4j.core/src/main/java/
python3 features_extractor.py features.md /symfinder-json-output.json