from NeoGraph import NeoPythonGraph

from flask_restful.representations import json

if __name__ == '__main__':
    neo = NeoPythonGraph("bolt://localhost:7687", "neo4j", "root")
    nodes = json.dumps({"nodes": neo.get_nodes(), "links": neo.get_links()})
    print(nodes)
    neo.close()
