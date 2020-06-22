import json
from sys import argv

from feature_mapper import Mapper, SourceFile, Method, JSONFilter

features_list = argv[1]
symfinder_json_output = argv[2]
selected_classes_file = argv[3]

with open(features_list, "r") as fil:
    lines = [line.strip() for line in fil.readlines() if line.startswith("+")]

with open(selected_classes_file, "r") as fil:
    selected_classes = [line.strip() for line in fil.readlines()]

source_files = []
methods = []


def add_source_file(entity_name, feature):
    existing_sourcefile = [sf for sf in source_files if sf.name == entity_name]
    if not existing_sourcefile:
        source_files.append(SourceFile(entity_name, [feature]))
    else:
        source_files[source_files.index(existing_sourcefile[0])].features.append(feature)


def add_method(method_name, parent, feature):
    existing_method = [m for m in methods if m.name == method_name]
    if not existing_method:
        methods.append(Method(method_name, parent, [feature]))
    else:
        methods[methods.index(existing_method[0])].features.append(feature)


if len(argv) == 5:
    for line in lines:
        plus, entity_type, entity_name, parent, feature = line.split()
        if entity_type in ["CLASS", "INTERFACE"]:
            add_source_file(entity_name, feature)
        if entity_type in ["METHOD"]:
            add_method(entity_name.split("(")[0], parent, feature)
        if entity_type in ["FIELD"]:
            add_source_file(parent, feature)
else:
    for line in lines:
        plus, entity_type, entity_name, parent, feature = line.split()
        if entity_type in ["CLASS", "INTERFACE"]:
            add_source_file(entity_name, feature)
        if entity_type in ["METHOD", "FIELD"]:
            add_source_file(parent, feature)

with open(symfinder_json_output, "r") as fil:
    symfinder_output = json.load(fil)

filtered_json = JSONFilter(symfinder_output, selected_classes).get_filtered_json()
mapper = Mapper(source_files, methods, filtered_json)
if len(argv) == 5:
    mapper.make_mapping_with_method_level()
else:
    mapper.make_mapping()
print(mapper.calculate_measures())
