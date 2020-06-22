#!/bin/sh

set -e

echo "Mapping on all vp-s"
python3 features_extractor.py groundTruth /symfinder-json-output.json

echo "Mapping on hotspots only"
python3 features_extractor.py groundTruth /symfinder-json-output.json hotspots