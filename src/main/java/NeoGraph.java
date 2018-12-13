import org.json.JSONObject;
import org.neo4j.driver.v1.*;
import org.neo4j.driver.v1.types.MapAccessor;
import org.neo4j.driver.v1.types.Node;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class NeoGraph {

    enum NodeType {
        CLASS, ABSTRACT, INNER, METHOD, CONSTRUCTOR, INTERFACE, STRATEGY
    }

    enum RelationType {
        METHOD, INNER, IMPLEMENTS, EXTENDS
    }

    private Driver driver;

    public NeoGraph(String uri, String user, String password) {
        driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password));
    }

    public NeoGraph(Driver driver) {
        this.driver = driver;
    }

    public Node createNode(String name, NodeType... types) {
        return createNode(name, name, types);
    }

    /**
     * Creates a node of corresponding name and types and returns it.
     *
     * @param name  Node name
     * @param types Node types
     */
    public Node createNode(String name, String shortName, NodeType... types) {
        return submitRequest(String.format("CREATE (n:%s { name: '%s', shortname: '%s' }) RETURN (n)",
                Arrays.stream(types).map(Enum::toString).collect(Collectors.joining(":")),
                name,
                shortName))
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

    public Node getOrCreateNode(String name, NodeType... types) {
        return getOrCreateNode(name, name, types);
    }

    /**
     * Returns the node if it exists, creates it and returns it otherwise.
     * As we use qualified names, each name is unique. Therefore, we can match only on node name.
     * If the node does not exist, it is created with the specified types as labels.
     * If it exists, the types are added as labels to the node.
     *
     * @param name  Node name
     * @param types Node types
     */
    public Node getOrCreateNode(String name, String shortName, NodeType... types) {
        List <Record> matchingNodes = submitRequest(String.format("MATCH (n) WHERE n.name = '%s' RETURN (n)", name)).list();
        if (matchingNodes.isEmpty()) {
            return createNode(name, shortName, types);
        }
        return submitRequest(String.format("MATCH (n) WHERE ID(n) = %s SET n:%s RETURN (n)",
                matchingNodes.get(0).get("n").asNode().id(),
                Arrays.stream(types).map(Enum::toString).collect(Collectors.joining(":"))))
                .list().get(0).get("n").asNode();
    }

    public void addLabelToNode(Node node, String label) {
        submitRequest(String.format("MATCH (n) WHERE ID(n) = %s SET n:%s RETURN (n)", node.id(), label));
    }

    public void writeGraphFile(String filePath) {
        Path path = Paths.get(filePath);
        try {
            if (path.toFile().getParentFile().exists() || (path.toFile().getParentFile().mkdirs() && path.toFile().createNewFile())) {
                try (BufferedWriter bw = Files.newBufferedWriter(path)) {
                    bw.write(generateJsonGraph());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /**
     * Get number of subclasses of a class
     *
     * @param node Node corresponding to the class
     *
     * @return Number of subclasses
     */
    public int getNbSubclasses(Node node) {
        return submitRequest(String.format("MATCH (c:CLASS)-[:EXTENDS]->(c2:CLASS) " +
                "WHERE ID(c) = %s " +
                "RETURN count(c2)", node.id()))
                .list().get(0).get(0).asInt();
    }

    private String generateJsonGraph() {
        return String.format("{\"nodes\":[%s],\"links\":[%s]}", getNodesAsJson(), getLinksAsJson());
    }

    private String getNodesAsJson() {
        return submitRequest("MATCH (c) WHERE c:CLASS OR c:INTERFACE RETURN collect({type:labels(c), name:c.name, shortname:c.shortname, nodeSize:c.methods, intensity:c.constructors})")
                .list()
                .get(0)
                .get(0)
                .asList(MapAccessor::asMap)
                .stream()
                .map(o -> new JSONObject(o).toString())
                .collect(Collectors.joining(","));
    }

    private String getLinksAsJson() {
        return submitRequest("MATCH (c1)-[r:INNER|:EXTENDS|:IMPLEMENTS]->(c2) RETURN collect({source:c1.name, target:c2.name, type:TYPE(r)})")
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

    public void closeDriver() {
        driver.close();
    }

}
