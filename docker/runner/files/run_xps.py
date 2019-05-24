import os
import yaml

from mako.template import Template

ENV_FILE_TEMPLATE = r"""
SOURCES_PACKAGE=${sources_package}
GRAPH_OUTPUT_PATH=${graph_output_path}
PROJECT_NAME=${project_name}
"""

with open('symfinder.yaml', 'r') as config_file:
    data = yaml.load(config_file.read())
    with open("experiences/" + data["experiencesFile"], 'r') as experiences_file:
        experiences = yaml.load(experiences_file.read())
        for xp_name, xp_config in experiences.items():
            for id in xp_config.get("tagIds", []) + xp_config.get("commitIds", []):
                xp_codename = xp_name + "-" + str(id).replace("/", "_")
                build_image = xp_config.get("buildImage", {}).get("path", "")
                with open("symfinder-compose.env", 'w+') as output_file:
                    sources_package = os.path.join(xp_codename, xp_config["sourcePackage"])
                    graph_output_path = "generated_visualizations/data/{}.json".format(xp_codename)
                    project_name=xp_codename
                    output_file.write(Template(ENV_FILE_TEMPLATE).render(
                        sources_package=sources_package,
                        graph_output_path=graph_output_path,
                        project_name=xp_codename
                    ))
                os.system("bash rerun.sh {} {} {}".format(sources_package, graph_output_path, project_name))
