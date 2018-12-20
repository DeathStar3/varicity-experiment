import subprocess

import yaml

with open('config.yaml', 'r') as config_file:
    data = yaml.load(config_file.read())
    for xp_name, xp_config in data["experiences"].items():
        repository_url = xp_config["repositoryUrl"]
        if "tagIds" in xp_config:
            for tag in xp_config["tagIds"]:
                subprocess.run(["./download_project.sh", "tag", repository_url, xp_name, tag], stdout=subprocess.PIPE)
        if "commitIds" in xp_config:
            for commit in xp_config["commitIds"]:
                subprocess.run(["./download_project.sh", "commit", repository_url, xp_name, commit], stdout=subprocess.PIPE)
