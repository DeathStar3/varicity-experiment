import unittest
from feature_mapper import Mapper, SourceFile
from utils import NamedObjectList


class MyTestCase(unittest.TestCase):

    def test_one_true_positive(self):
        mapper = Mapper(
            NamedObjectList("name", [SourceFile("Class1", ["feature1"])]),
            NamedObjectList("name"),
            {"nodes": [{"name": "Class1", "types": ["VP"], "methods": [], "constructors": []}], "links": []})
        mapper.make_mapping()
        result = mapper.calculate_measures_for_class_traces()
        self.assertEqual(1, result.get_true_positives())
        self.assertEqual(0, result.get_false_positives())
        self.assertEqual(0, result.get_false_negatives())
        self.assertEqual(1, result.get_number_of_traces())

    def test_one_false_positive_one_false_negative(self):
        mapper = Mapper(
            NamedObjectList("name", [SourceFile("Class1", ["feature1"])]),
            NamedObjectList("name"),
            {"nodes": [{"name": "Class2", "types": ["VP"], "methods": [], "constructors": []}], "links": []})
        mapper.make_mapping()
        result = mapper.calculate_measures_for_class_traces()
        self.assertEqual(0, result.get_true_positives())
        self.assertEqual(1, result.get_false_positives())
        self.assertEqual(1, result.get_false_negatives())
        self.assertEqual(1, result.get_number_of_traces())

    def test_two_false_positives_one_false_negative(self):
        mapper = Mapper(
            NamedObjectList("name", [SourceFile("Class1", ["feature1"])]),
            NamedObjectList("name"),
            {"nodes": [{"name": "Class2", "types": ["VP"], "methods": [], "constructors": []},
                       {"name": "Class3", "types": ["VARIANT"], "methods": [], "constructors": []}], "links": []})
        mapper.make_mapping()
        result = mapper.calculate_measures_for_class_traces()
        self.assertEqual(0, result.get_true_positives())
        self.assertEqual(2, result.get_false_positives())
        self.assertEqual(1, result.get_false_negatives())
        self.assertEqual(1, result.get_number_of_traces())

    def test_one_false_positive_two_false_negatives(self):
        mapper = Mapper(
            NamedObjectList("name", [SourceFile("Class1", ["feature1"]), SourceFile("Class2", ["feature2"])]),
            NamedObjectList("name"),
            {"nodes": [{"name": "Class3", "types": ["VARIANT"], "methods": [], "constructors": []}], "links": []})
        mapper.make_mapping()
        result = mapper.calculate_measures_for_class_traces()
        self.assertEqual(0, result.get_true_positives())
        self.assertEqual(1, result.get_false_positives())
        self.assertEqual(2, result.get_false_negatives())
        self.assertEqual(2, result.get_number_of_traces())

    def test_multiple_traces_for_one_class(self):
        mapper = Mapper(
            NamedObjectList("name", [SourceFile("Class1", ["feature1", "feature2"])]),
            NamedObjectList("name"),
            {"nodes": [{"name": "Class1", "types": ["VARIANT"], "methods": [], "constructors": []}], "links": []})
        mapper.make_mapping()
        result = mapper.calculate_measures_for_class_traces()
        self.assertEqual(2, result.get_true_positives())
        self.assertEqual(0, result.get_false_positives())
        self.assertEqual(0, result.get_false_negatives())
        self.assertEqual(2, result.get_number_of_traces())


if __name__ == '__main__':
    unittest.main()
