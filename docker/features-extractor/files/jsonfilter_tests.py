import unittest
from feature_mapper import JSONFilter


class MyTestCase(unittest.TestCase):

    def test_one_class_in_output_and_is_selected(self):
        json_output = {"nodes": [{"name": "Class1", "types": ["VP"], "methods": [], "constructors": []}], "links": []}
        selected_classes = ["Class1"]
        filtered_json = JSONFilter(json_output, selected_classes).get_filtered_json()
        self.assertEqual(1, len(filtered_json["nodes"]))

    def test_one_class_in_output_and_no_one_is_selected(self):
        json_output = {"nodes": [{"name": "Class1", "types": ["VP"], "methods": [], "constructors": []}], "links": []}
        selected_classes = []
        filtered_json = JSONFilter(json_output, selected_classes).get_filtered_json()
        self.assertEqual(0, len(filtered_json["nodes"]))

    def test_two_classes_in_output_and_one_is_selected(self):
        json_output = {"nodes": [{"name": "Class1", "types": ["VP"], "methods": [], "constructors": []},
                                 {"name": "Class2", "types": [""], "methods": [], "constructors": []}], "links": []}
        selected_classes = ["Class1"]
        filtered_json = JSONFilter(json_output, selected_classes).get_filtered_json()
        self.assertEqual(1, len(filtered_json["nodes"]))
        self.assertEqual("Class1", filtered_json["nodes"][0]["name"])

    def test_two_classes_in_output_and_two_are_selected(self):
        json_output = {"nodes": [{"name": "Class1", "types": ["VP"], "methods": [], "constructors": []},
                                 {"name": "Class2", "types": [""], "methods": [], "constructors": []}], "links": []}
        selected_classes = ["Class1", "Class2"]
        filtered_json = JSONFilter(json_output, selected_classes).get_filtered_json()
        self.assertEqual(2, len(filtered_json["nodes"]))

    def test_class_variant_should_be_selected(self):
        json_output = {"nodes": [{"name": "Class1", "types": ["VP"], "methods": [], "constructors": []},
                                 {"name": "Class2", "types": ["VARIANT"], "methods": [], "constructors": []}],
                       "links": [{"type": "EXTENDS", "source": "Class1", "target": "Class2"}]}
        selected_classes = ["Class1"]
        filtered_json = JSONFilter(json_output, selected_classes).get_filtered_json()
        self.assertEqual(2, len(filtered_json["nodes"]))

    def test_both_class_variants_should_be_selected(self):
        json_output = {"nodes": [{"name": "Class1", "types": ["VP"], "methods": [], "constructors": []},
                                 {"name": "Class2", "types": ["VARIANT"], "methods": [], "constructors": []},
                                 {"name": "Class3", "types": ["VARIANT"], "methods": [], "constructors": []}],
                       "links": [{"type": "EXTENDS", "source": "Class1", "target": "Class2"},
                                 {"type": "EXTENDS", "source": "Class1", "target": "Class3"}]}
        selected_classes = ["Class1"]
        filtered_json = JSONFilter(json_output, selected_classes).get_filtered_json()
        self.assertEqual(3, len(filtered_json["nodes"]))

    def test_parent_class_should_not_be_selected(self):
        json_output = {"nodes": [{"name": "Class1", "types": ["VP"], "methods": [], "constructors": []},
                                 {"name": "Class2", "types": ["VARIANT"], "methods": [], "constructors": []}],
                       "links": [{"type": "EXTENDS", "source": "Class1", "target": "Class2"}]}
        selected_classes = ["Class2"]
        filtered_json = JSONFilter(json_output, selected_classes).get_filtered_json()
        self.assertEqual(1, len(filtered_json["nodes"]))
        self.assertEqual("Class2", filtered_json["nodes"][0]["name"])


if __name__ == '__main__':
    unittest.main()
