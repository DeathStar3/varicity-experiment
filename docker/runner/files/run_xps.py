import os
import yaml

with open('symfinder.yaml', 'r') as config_file:
    data = yaml.load(config_file.read())
    with open("experiments/" + data["experimentsFile"], 'r') as experiments_file:
        experiments = yaml.load(experiments_file.read())
        for xp_name, xp_config in experiments.items():
            for id in xp_config.get("tagIds", []) + xp_config.get("commitIds", []):
                xp_codename = xp_name + "-" + str(id).replace("/", "_")
                build_image = xp_config.get("buildImage", {}).get("path", "")
                sources_package = os.path.join(xp_codename, xp_config["sourcePackage"])
                graph_output_path = "generated_visualizations/data/{}.json".format(xp_codename)
                os.system("bash rerun.sh {} {} {}".format(sources_package, graph_output_path, xp_codename))
