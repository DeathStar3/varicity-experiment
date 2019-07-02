from neo4j import GraphDatabase


class NeoPythonGraph:

    def __init__(self, uri, user, password):
        self._driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self._driver.close()

    def get_nodes(self):
        with self._driver.session() as session:
            node = session.write_transaction(self._get_nodes)
            return node

    def get_links(self):
        with self._driver.session() as session:
            node = session.write_transaction(self._get_links)
            return node

    def update_node(self, name, complexity, coverage):
        with self._driver.session() as session:
            session.write_transaction(self._update_node, name, complexity, coverage)

    def delete_graph(self):
        with self._driver.session() as session:
            session.write_transaction(self._delete_graph)

    @staticmethod
    def _get_nodes(tx):
        result = tx.run('MATCH (c:VP) '
                        'WHERE (c:CLASS OR c:INTERFACE) AND NOT c:OUT_OF_SCOPE '
                        'RETURN collect({'
                        'types:labels(c),'
                        'name:c.name,'
                        'methods:c.methods,'
                        'constructors:c.constructors,'
                        'complexity:c.complexity,'
                        'coverage:c.coverage,'
                        'nbVariants:c.nbVariants})')
        return list(result)[0].items()[0][1]

    @staticmethod
    def _get_links(tx):
        result = tx.run('MATCH path = (c1:VP)-[r:INNER|:EXTENDS|:IMPLEMENTS]->(c2:VP) '
                        'WHERE NONE(n IN nodes(path) WHERE n:OUT_OF_SCOPE) '
                        'RETURN collect({source:c1.name, target:c2.name, type:TYPE(r)})')
        return list(result)[0].items()[0][1]

    @staticmethod
    def _update_node(tx, name, complexity, coverage):
        tx.run(
            'MATCH(n) WHERE n.name = $name SET n.complexity = $complexity, n.coverage = $coverage RETURN (n)',
            name=name, complexity=complexity, coverage=coverage)

    @staticmethod
    def _delete_graph(tx):
        tx.run('MATCH(n) DETACH DELETE(n)')
