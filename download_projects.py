import os
import subprocess
import yaml


def download_project():
    subprocess.run(["./download_project.sh", "download", repository_url, project_directory])


def checkout_versions(id_type, *ids):
    subprocess.run(["./download_project.sh", id_type, project_directory, *ids])


def delete_project():
    subprocess.run(["./download_project.sh", "delete", project_directory])


with open('symfinder.yaml', 'r') as config_file:
    data = yaml.load(config_file.read(), Loader=yaml.FullLoader)
    for xp_name, xp_config in data["experiences"].items():
        projects_package = "resources"
        repository_url = xp_config["repositoryUrl"]
        project_directory = os.path.join(projects_package, xp_name)
        download_project()
        if "tagIds" in xp_config:
            # cast to string in case of numerical tag id (e.g. 1.0)
            checkout_versions("tag", *[str(id) for id in xp_config["tagIds"]])
        if "commitIds" in xp_config:
            checkout_versions("commit", *xp_config["commitIds"])
        delete_project()
