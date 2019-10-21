import csv
import json

from sys import argv

# Takes for input a symfinder JSON output file
# and writes a CSV file containing on each row a VP name and the name of one of its variants.

# 1st argument : path to the JSON file
# 2nd argument : CSV output file name

with open(argv[1], "r") as input_file:
    data = json.load(input_file)
    nodes = data["nodes"]
    links = data["links"]
    vps = [node for node in nodes if "VP" in node["types"]]
    output_for_csv = []
    for vp in vps:
        vp_name = vp["name"]
        variants = [link["target"] for link in links if link["source"] == vp_name]
        for variant in variants:
            output_for_csv.append({"vp": vp_name, "variant": variant})
    with open(argv[2], 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["vp", "variant"])
        writer.writeheader()
        for data in output_for_csv:
            writer.writerow(data)
    print(output_for_csv)
