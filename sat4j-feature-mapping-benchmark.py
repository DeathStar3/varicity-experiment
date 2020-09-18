import json
import os
import yaml


benchmarks_file = "sat4j-benchmarks.txt"

thresholds = [1, 2, 3, 5, 10, 15, 20]
# thresholds = [i for i in range(1, 11)] + [15] + [i for i in range(20, 100, 10)]

for i in thresholds:
    with open('symfinder.yaml', 'r') as config_file:
        data = yaml.load(config_file.read(), Loader=yaml.FullLoader)

    data["hotspots"]["nbVariantsThreshold"] = i

    with open('symfinder.yaml', 'w') as config_file:
        yaml.dump(data, config_file)

    os.system("bash sat4j-feature-mapping.sh --local")

    mapping_result = {}

    with open("generated_visualizations/data/sat4j-22374e5e-mapping.json", 'r') as fil:
        # if fil.read(1):
        mapping_result = json.load(fil)

    append_write = 'a' if os.path.exists(benchmarks_file) else 'w'

    with open(benchmarks_file, append_write) as fil:
        fil.write("{}: {}\n".format(i, json.dumps(mapping_result)))
