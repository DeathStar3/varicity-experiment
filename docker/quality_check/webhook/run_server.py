import json
import subprocess

import requests
from NeoGraph import NeoPythonGraph
from flask import Flask, request

app = Flask(__name__)
key = ""


@app.route('/sonar_report', methods=['POST'])
def result():
    metrics = get_sonar_metrics(request.json)
    app.logger.info(metrics)
    p_status = ping_symfinder()
    app.logger.info(p_status)
    while p_status == 0:
        p_status = ping_symfinder()
        app.logger.info(p_status)
    neo = NeoPythonGraph("bolt://neo4j:7687", "neo4j", "root")
    for metric in metrics:
        app.logger.info(metric)
        neo.update_node(metric["className"], metric["metrics"].get("complexity", 0),
                        metric["metrics"].get("coverage", 0))
    write_graph_file(neo)
    neo.delete_graph()
    neo.close()
    request.environ.get('werkzeug.server.shutdown')()
    return 'Server shutting down...'


def get_sonar_metrics(report_hook):
    global key
    key = report_hook["project"]["key"]
    current_page_index = 1
    measures_json = get_measures_from_sonar(key, current_page_index)
    nb_classes = measures_json["paging"]["total"]
    metrics = get_metrics_from_sonar_measures(measures_json)
    while len(metrics) < nb_classes:
        current_page_index += 1
        metrics += get_metrics_from_sonar_measures(get_measures_from_sonar(key, current_page_index))
    return metrics


def ping_symfinder():
    p = subprocess.Popen("ping -c 1 symfinder:8080", stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    p.communicate()
    return p.wait()


def write_graph_file(neo):
    with open("/generated_visualizations/data/{}.json".format(key), "w+") as output_file:
        output_file.write(json.dumps({"nodes": neo.get_nodes(), "links": neo.get_links()}))
    p = subprocess.Popen("chown -R $SYMFINDER_UID:$SYMFINDER_GID /generated_visualizations",
                         stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE,
                         shell=True)
    p.communicate()
    return p.wait()


def get_metrics_from_sonar_measures(measures_json):
    # This line below does a lot of things
    # SonarQube only gives us the class path and not its package. Therefore we need to find it.
    # As projects are built with Maven, all classes paths conform to the pattern src/[main|test]/java/<class name>.
    # This is why we can split the path to obtain the package name so easily.
    # We also filter for test classes.
    return [{"className": ".".join(component["path"].split(".java")[0].split("/")[3:]),
             "metrics": {measure["metric"]: float(measure["value"]) for measure in component["measures"]}}
            for component in measures_json["components"]]


def get_measures_from_sonar(key, page_index):
    return requests.get(
        "http://sonarqube-server:9000/api/measures/component_tree?baseComponentKey={}&qualifiers=FIL&metricKeys=complexity,coverage&ps=500&p={}".format(
            key, page_index)).json()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
    # print(subprocess.call("ping -c 1 localhost", stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True))
