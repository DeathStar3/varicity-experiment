import os
import yaml

from mako.template import Template

ENV_FILE_TEMPLATE = r"""
SOURCES_PACKAGE=${sources_package}
GRAPH_OUTPUT_PATH=${graph_output_path}
LOG_FILE_NAME=${log_file_name}
"""

with open('symfinder.yaml', 'r') as config_file:
    data = yaml.load(config_file.read(), Loader=yaml.FullLoader)
    with open("experiences/"+data["experiencesFile"], 'r') as experiences_file:
        experiences = yaml.load(experiences_file.read(), Loader=yaml.FullLoader)
        for xp_name, xp_config in experiences.items():
            for id in xp_config.get("tagIds", []) + xp_config.get("commitIds", []):
                xp_codename = xp_name + "-" + str(id).replace("/", "_")
                with open("symfinder-compose.env", 'w+') as output_file:
                    sources_package = os.path.join(xp_codename, xp_config["sourcePackage"])
                    graph_output_path = "generated_visualizations/data/{}.json".format(xp_codename)
                    output_file.write(Template(ENV_FILE_TEMPLATE).render(
                        sources_package=sources_package,
                        graph_output_path=graph_output_path,
                        log_file_name=xp_codename
                    ))
                os.system("bash rerun.sh %s" % xp_codename)
