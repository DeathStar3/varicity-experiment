import org.json.JSONObject;
import org.neo4j.driver.v1.*;
import org.neo4j.driver.v1.types.MapAccessor;
import org.neo4j.driver.v1.types.Node;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class NeoGraph {

    enum NodeType {
        CLASS, METHOD, CONSTRUCTOR
    }

    enum RelationType {
        METHOD, INNER_CLASS
    }

    private Driver driver;

    public NeoGraph(String uri, String user, String password) {
        driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password));
    }

    /**
     * Creates a node of corresponding name and type and returns it.
     *
     * @param name Node name
     * @param type Node type
     */
    public Node createNode(String name, NodeType type) {
        return submitRequest(String.format("CREATE (n:%s { name: '%s' }) RETURN (n)", type, name))
                .list().get(0).get(0).asNode();
    }

    /**
     * Creates the relationship node1 -> node2 of the given type.
     *
     * @param node1 source node
     * @param node2 target node
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

    /**
     * Returns a map containing for each overloaded method the number of overloads it has in the class.
     * <p>
     * Example of a class containing the following methods:
     * - public void add(Point2D pt)
     * - public void add(Rectangle2D r)
     * - public void add(double newx, double newy)
     * - public PathIterator getPathIterator(AffineTransform at)
     * - public PathIterator getPathIterator(AffineTransform at, double flatness)
     * - public void setFrame(double x, double y, double w, double h)
     * <p>
     * The returned map will be : {"add": 3, "getPathIterator": 2}
     * As setFrame is not overloaded, it will not appear in the map.
     *
     * @param parent
     *
     * @return
     */
    public Map <String, Long> getNbOverloads(String parent) {
        return submitRequest(String.format(
                "MATCH (:CLASS { name: '%s' })-->(a:METHOD) MATCH (:CLASS { name: '%s' })-->(b:METHOD)\n" +
                        "WHERE a.name = b.name AND ID(a) <> ID(b)\n" +
                        "return DISTINCT a.name, count(DISTINCT a)", parent, parent))
                .list()
                .stream()
                .map(Record::asMap)
                .collect(Collectors.toMap(
                        recordMap -> (String) recordMap.get("a.name"),
                        recordMap -> (Long) recordMap.get("count(DISTINCT a)")));

    }

    /**
     * Sets the number of methods with different names defined more than once in the class.
     * <p>
     * Example of a class containing the following methods:
     * - public void add(Point2D pt)
     * - public void add(Rectangle2D r)
     * - public void add(double newx, double newy)
     * - public PathIterator getPathIterator(AffineTransform at)
     * - public PathIterator getPathIterator(AffineTransform at, double flatness)
     * <p>
     * Two methods are overloaded, therefore the value returned will be 2.
     * This is independent of the numbers of overloads for each method.
     * If no method is overloaded, the property is not set.
     */
    public void setMethodsOverloads() {
        submitRequest("MATCH (c:CLASS)-->(a:METHOD) MATCH (c:CLASS)-->(b:METHOD)\n" +
                "WHERE a.name = b.name AND ID(a) <> ID(b)\n" +
                "WITH count(DISTINCT a.name) AS cnt, c\n" +
                "SET c.methods = cnt");
        submitRequest("MATCH (c:CLASS)\n" +
                "WHERE NOT EXISTS(c.methods)\n" +
                "SET c.methods = 0");
    }

    /**
     * The reasoning is the same as for 'setMethodsOverloads'.
     * However, as all constructors have the same name, an overloaded constructor results in a returned value of 1.
     * If the constructor is not overloaded, the property is not set.
     */
    public void setConstructorsOverloads() {
        submitRequest("MATCH (c:CLASS)-->(a:CONSTRUCTOR)\n" +
                "WITH count(a.name) AS cnt, c\n" +
                "SET c.constructors = cnt");
        submitRequest("MATCH (c:CLASS)\n" +
                "WHERE NOT EXISTS(c.constructors)\n" +
                "SET c.constructors = 0");
    }

    /**
     * Returns the node if it exists, creates it and returns it otherwise.
     *
     * @param name Node name
     * @param type Node type
     */
    public Node getOrCreateNode(String name, NodeType type) {
        List <Record> matchingNodes = submitRequest(String.format("MATCH (n:%s) WHERE n.name = '%s' RETURN (n)", type, name)).list();
        if (matchingNodes.isEmpty()) {
            return createNode(name, type);
        }
        return matchingNodes.get(0).get("n").asNode();
    }

    public void writeGraphFile(String filePath) {
        try (BufferedWriter bw = Files.newBufferedWriter(Paths.get(filePath))) {
            bw.write(generateJsonGraph());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String generateJsonGraph() {
        return String.format("{\"nodes\":[%s],\"links\":[%s]}", getNodesAsJson(), getLinksAsJson());
    }

    private String getNodesAsJson() {
        return submitRequest("MATCH (c:CLASS) RETURN collect({name:c.name, nodeSize:c.methods, intensity:c.constructors})")
                .list()
                .get(0)
                .get(0)
                .asList(MapAccessor::asMap)
                .stream()
                .map(o -> new JSONObject(o).toString())
                .collect(Collectors.joining(","));
    }

    private String getLinksAsJson() {
        return submitRequest("MATCH (c1:CLASS)-[r]->(c2:CLASS) RETURN collect({source:c1.name, target:c2.name})")
                .list()
                .get(0)
                .get(0)
                .asList(MapAccessor::asMap)
                .stream()
                .map(o -> new JSONObject(o).toString())
                .collect(Collectors.joining(","));
    }

    /**
     * Deletes all nodes and relationships in the graph.
     */
    public void deleteGraph() {
        submitRequest("MATCH (n) DETACH DELETE (n)");
    }

    private StatementResult submitRequest(String request) {
        try (Session session = driver.session()) {
            return session.writeTransaction(tx -> tx.run(request));
        }
    }

}
