import json
from sys import argv

from utils import JSONSerializable, NamedObjectList

features_list = argv[1]
symfinder_json_output = argv[2]


class SourceFile(JSONSerializable):

    def __init__(self, name, features=[]):
        self.name = name
        self.features = features
        self.vp = False
        self.variant = False

    def is_vp(self):
        return self.vp

    def is_variant(self):
        return self.variant


class Method(JSONSerializable):

    def __init__(self, name, parent_class, features=[]):
        self.name = name
        self.parent_class = parent_class
        self.features = features
        self.vp = False

    def is_vp(self):
        return self.vp


def print_stat(message, value):
    print("%s: %s" % (message, str(value)))


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


# Adapt this
def get_method_with_parent(node_name):
    returned = None
    for i, method in enumerate(methods):
        if method.parent_class == node_name:
            returned = i
            break
    return returned


for node in symfinder_output["nodes"]:
    node_name = node["name"]
    if node_name not in source_files:
        source_files.append(SourceFile(node_name))
    source_file = source_files[node_name]
    source_file.vp = "VP" in node["types"]
    source_file.variant = "VARIANT" in node["types"]
    if node["constructors"]:
        constructor = node["constructors"][0]
        constructor_name = constructor["name"]
        if constructor["number"] > 1:
            if constructor_name not in methods:
                methods.append(Method(constructor_name, node_name))
            methods[constructor_name].vp = True
    if node["methods"]:
        for method in node["methods"]:
            method_name = method["name"]
            if method["number"] > 1:
                if method_name not in methods:
                    methods.append(Method(method_name, node_name))
                methods[method_name].vp = True

print("CLASSES")
print_stat("Number of files linked to a feature", len([f for f in source_files if f.features]))

tp = len([f for f in source_files if f.features and (f.vp or f.variant)])
fp = len([f for f in source_files if not f.features and (f.vp or f.variant)])
fn = len([f for f in source_files if f.features and not (f.vp or f.variant)])

print_stat("Number of VPs and variants linked to features (TP)", tp)
print_stat("Number of VPs and variants not linked to features (FP)", fp)
print_stat("Number of features traces not linked to any VP nor variant (FN)", fn)
print_stat("Precision = TP / (TP + FP)", tp / (tp + fp))
print_stat("Recall = TP / (TP + FN)", tp / (tp + fn))

print("\nMETHODS AND CONSTRUCTORS")
print_stat("Number of methods and constructors linked to a feature", len([f for f in methods if f.features]))

tp_methods = len([f for f in methods if f.features and f.vp])
fp_methods = len([f for f in methods if not f.features and f.vp])
fn_methods = len([f for f in methods if f.features and not f.vp])

print_stat("Number of VPs and variants linked to features (TP)", tp_methods)
print_stat("Number of VPs and variants not linked to features (FP)", fp_methods)
print_stat("Number of features traces not linked to any VP nor variant (FN)", fn_methods)
print_stat("Precision = TP / (TP + FP)", tp_methods / (tp_methods + fp_methods))
print_stat("Recall = TP / (TP + FN)", tp_methods / (tp_methods + fn_methods))
