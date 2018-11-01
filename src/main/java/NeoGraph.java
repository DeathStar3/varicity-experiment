import org.neo4j.driver.v1.*;
import org.neo4j.driver.v1.types.Node;

import java.util.Map;
import java.util.stream.Collectors;

public class NeoGraph {

    enum NodeType {
        CLASS, METHOD
    }

    enum RelationType {
        METHOD
    }

    private Driver driver;

    public NeoGraph(String uri, String user, String password) {
        driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password));
    }

    public Node createNode(String name, NodeType type) {
        return submitRequest(String.format("CREATE (n:%s { name: '%s' }) RETURN (n)", type, name))
                .list().get(0).get(0).asNode();
    }

    /**
     * node1 -> node2
     *
     * @param node1
     * @param node2
     */
    public void linkTwoNodes(Node node1, Node node2, RelationType type) {
        submitRequest(String.format("MATCH(a)\n" +
                "WHERE ID(a)=%s\n" +
                "WITH a\n" +
                "MATCH (b)\n" +
                "WITH a,b\n" +
                "WHERE ID(b)=%s\n" +
                "CREATE (a)-[r:%s]->(b)", node1.id(), node2.id(), type));
    }

    public Map <String, Long> getNbOverloads() {
        return submitRequest("MATCH (a:METHOD) MATCH (b:METHOD)\n" +
                "WHERE a.name = b.name AND ID(a) <> ID(b)\n" +
                "return DISTINCT a.name, count(DISTINCT a)")
                .list()
                .stream()
                .map(Record::asMap)
                .collect(Collectors.toMap(
                        recordMap -> (String) recordMap.get("a.name"),
                        recordMap -> (Long) recordMap.get("count(DISTINCT a)"))
                );

    }

    public void deleteGraph() {
        submitRequest("MATCH (n) DETACH DELETE (n)");
    }

    public StatementResult submitRequest(String request) {
        try (Session session = driver.session()) {
            return session.writeTransaction(tx -> tx.run(request));
        }
    }

}
