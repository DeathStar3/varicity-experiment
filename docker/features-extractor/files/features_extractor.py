import json
from sys import argv

from utils import JSONSerializable, NamedObjectList
from feature_mapper import Mapper, SourceFile, Method

features_list = argv[1]
symfinder_json_output = argv[2]

with open(features_list, "r") as fil:
    lines = [line.strip() for line in fil.readlines() if line.startswith("+")]

source_files = NamedObjectList("name")
methods = NamedObjectList("name")

for line in lines:
    plus, entity_type, entity_name, parent, feature = line.split()
    if entity_type in ["CLASS", "INTERFACE"]:
        source_files.append(SourceFile(entity_name, [feature]))
    if entity_type in ["METHOD"]:
        methods.append(Method(entity_name.split("(")[0], parent, [feature]))

with open(symfinder_json_output, "r") as fil:
    symfinder_output = json.load(fil)

mapper = Mapper(source_files, methods, symfinder_output)
mapper.make_mapping()
mapper.calculate_all_measures()
