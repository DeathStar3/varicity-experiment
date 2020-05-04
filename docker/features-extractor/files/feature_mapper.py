from functools import reduce

from utils import JSONSerializable


class Asset(JSONSerializable):

    def __init__(self, name, features=[]):
        self.name = name
        self.features = features
        self.vp = False
        self.variant = False

    def is_vp_or_variant(self):
        return self.is_vp() or self.is_variant()

    def is_vp(self):
        return self.vp

    def is_variant(self):
        return self.variant


class SourceFile(Asset):

    def __init__(self, name, features=[]):
        super().__init__(name, features)


class Method(Asset):

    def __init__(self, name, parent_class, features=[]):
        super().__init__(name, features)
        self.parent_class = parent_class


class Mapper:

    def __init__(self, classes_with_feature, methods_with_feature, json_output):
        self.classes_list = classes_with_feature
        self.methods_list = methods_with_feature
        self.json_output = json_output

    def make_mapping(self):
        for node in self.json_output["nodes"]:
            node_name = self.map_class(node)
            if node["constructors"]:
                constructor = node["constructors"][0]
                self.map_method(constructor, node_name)
            if node["methods"]:
                for method in node["methods"]:
                    self.map_method(method, node_name)

    def map_class(self, class_object):
        node_name = class_object["name"]
        if node_name not in self.classes_list:
            self.classes_list.append(SourceFile(node_name))
        source_file = self.classes_list[node_name]
        source_file.vp = "VP" in class_object["types"]
        source_file.variant = "VARIANT" in class_object["types"]
        return node_name

    def map_method(self, method, parent_name):
        name = method["name"]
        if method["number"] > 1:
            if name not in self.methods_list:
                self.methods_list.append(Method(name, parent_name))
            self.methods_list[name].vp = True

    def calculate_all_measures(self):
        print("CLASSES")
        print(self.calculate_measures_for_class_traces())
        print("\nMETHODS AND CONSTRUCTORS")
        print(self.calculate_measures_for_method_traces())

    def calculate_measures_for_class_traces(self):
        return MappingResults(self.classes_list)

    def calculate_measures_for_method_traces(self):
        return MappingResults(self.methods_list)


class MappingResults:

    def __init__(self, assets):
        self.assets = assets

    # Number of traces
    def get_number_of_traces(self):
        traces = reduce(lambda a, b: a + b, [a.features for a in self.assets], [])
        return len(traces)

    # Number of traces feature <--> asset where the asset is a VP or variant
    def get_true_positives(self):
        traces = reduce(lambda a, b: a + b, [a.features for a in self.assets if a.is_vp_or_variant()], [])
        return len(traces)

    # Number of assets being a VP or variant but not linked to any feature
    def get_false_positives(self):
        return len([a for a in self.assets if not a.features and a.is_vp_or_variant()])

    # Number of traces feature <--> asset where the asset is not a VP nor variant
    def get_false_negatives(self):
        traces = reduce(lambda a, b: a + b, [a.features for a in self.assets if not a.is_vp_or_variant()], [])
        return len(traces)

    def get_precision(self):
        tp = self.get_true_positives()
        fp = self.get_false_positives()
        return tp / (tp + fp)

    def get_recall(self):
        tp = self.get_true_positives()
        fn = self.get_false_negatives()
        return tp / (tp + fn)

    def __str__(self):
        return """Number of assets linked to a feature: %s
Number of VPs and variants linked to features (TP): %s
Number of VPs and variants not linked to features (FP): %s
Number of features traces not linked to any VP nor variant (FN): %s
Precision = TP / (TP + FP): %s
Recall = TP / (TP + FN): %s""" % (self.get_number_of_traces(),
                                  self.get_true_positives(), self.get_false_positives(), self.get_false_negatives(),
                                  self.get_precision(), self.get_recall())


def print_stat(message, value):
    print("%s: %s" % (message, str(value)))
