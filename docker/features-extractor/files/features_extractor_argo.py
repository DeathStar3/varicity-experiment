import json
import os
import re
from sys import argv

from feature_mapper import Mapper, SourceFile, Method

features_lists_dir = argv[1]
symfinder_json_output = argv[2]

source_files = []
methods = []

regex = re.compile(r"^(.*)(\(.*\)) (.*)$", re.MULTILINE)


def add_source_file(sourcefile):
    existing_sourcefile = [s for s in source_files if s.name == sourcefile.name]
    if existing_sourcefile:
        source_files[source_files.index(existing_sourcefile[0])].features.append(sourcefile.features[0])
    else:
        source_files.append(sourcefile)


def add_method(method):
    existing_method = [m for m in methods if m == method]
    if existing_method:
        methods[methods.index(existing_method[0])].features.append(method.features[0])
    else:
        methods.append(method)


for filename in os.listdir(features_lists_dir):
    if filename.endswith(".txt"):
        feature_name = filename.split(".txt")[0]
        with open(os.path.join(features_lists_dir, filename), "r") as fil:
            lines = [line.strip() for line in fil.readlines()]
        if len(argv) == 4:
            for line in lines:
                line = regex.sub(r"\g<1>() \g<3>".strip(), line)
                line_items = line.split()
                if len(line_items) == 1:  # class level
                    add_source_file(SourceFile(line_items[0], [feature_name]))
                elif len(line_items) == 2:
                    if "Refinement" in line_items:  # class level refinement
                        class_name, _ = line_items
                        add_source_file(SourceFile(class_name, [feature_name]))
                    else:  # method
                        class_name, method_name = line_items
                        add_method(Method(method_name.split("(")[0], class_name, [feature_name]))
                else:  # len == 3, method refinement
                    class_name, method_name, _ = line_items
                    add_method(Method(method_name.split("(")[0], class_name, [feature_name]))
        else:
            for line in lines:
                line = regex.sub(r"\g<1>() \g<3>".strip(), line)
                line_items = line.split()
                if len(line_items) == 1:  # class level
                    add_source_file(SourceFile(line_items[0], [feature_name]))
                elif len(line_items) == 2:
                    if "Refinement" in line_items:  # class level refinement
                        class_name, _ = line_items
                        add_source_file(SourceFile(class_name, [feature_name]))
                    else:  # method
                        class_name, method_name = line_items
                        add_source_file(SourceFile(class_name, [feature_name]))
                else:  # len == 3, method refinement
                    class_name, method_name, _ = line_items
                    add_source_file(SourceFile(class_name, [feature_name]))

# print(source_files)
# print(methods)


with open(symfinder_json_output, "r") as fil:
    symfinder_output = json.load(fil)

mapper = Mapper(source_files, methods, symfinder_output)
if len(argv) == 4:
    mapper.make_mapping_with_method_level()
else:
    mapper.make_mapping()
print(mapper.calculate_measures())
