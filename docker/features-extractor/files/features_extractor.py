import json
from sys import argv

from feature_mapper import Mapper, SourceFile, Method

features_list = argv[1]
symfinder_json_output = argv[2]

with open(features_list, "r") as fil:
    lines = [line.strip() for line in fil.readlines() if line.startswith("+")]

source_files = []
methods = []

if len(argv) == 4:
    for line in lines:
        plus, entity_type, entity_name, parent, feature = line.split()
        if entity_type in ["CLASS", "INTERFACE"]:
            source_files.append(SourceFile(entity_name, [feature]))
        if entity_type in ["METHOD"]:
            methods.append(Method(entity_name.split("(")[0], parent, [feature]))
        if entity_type in ["FIELD"]:
            source_files.append(SourceFile(parent, [feature]))
else:
    for line in lines:
        plus, entity_type, entity_name, parent, feature = line.split()
        if entity_type in ["CLASS", "INTERFACE"]:
            source_files.append(SourceFile(entity_name, [feature]))
        if entity_type in ["METHOD"]:
            source_files.append(SourceFile(parent, [feature]))
        if entity_type in ["FIELD"]:
            source_files.append(SourceFile(parent, [feature]))


with open(symfinder_json_output, "r") as fil:
    symfinder_output = json.load(fil)

mapper = Mapper(source_files, methods, symfinder_output)
if len(argv) == 4:
    mapper.make_mapping_with_method_level()
else:
    mapper.make_mapping()
print(mapper.calculate_measures())
