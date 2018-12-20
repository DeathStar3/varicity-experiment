import subprocess

import yaml

with open('config.yaml', 'r') as config_file:
    data = yaml.load(config_file.read())
    for xp_name, xp_config in data["experiences"].items():
        param = ""
        if "commitId" in xp_config:
            param = "commit"
            subprocess.run(
                ["./download_project.sh", "commit", xp_config["repositoryUrl"], xp_name, xp_config["commitId"]],
                stdout=subprocess.PIPE)
        elif "tagId" in xp_config:
            param = "tag"
            subprocess.run(
                ["./download_project.sh", "tag", xp_config["repositoryUrl"], xp_name, xp_config["tagId"]],
                stdout=subprocess.PIPE)
