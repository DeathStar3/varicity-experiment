import neo4j_types.DesignPatternType;
import neo4j_types.EntityType;
import neo4j_types.NodeType;
import neo4j_types.RelationType;
import org.json.JSONObject;
import org.neo4j.driver.v1.*;
import org.neo4j.driver.v1.types.MapAccessor;
import org.neo4j.driver.v1.types.Node;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class NeoGraph {

    private Driver driver;

    public NeoGraph(String uri, String user, String password) {
        driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password));
    }

    public NeoGraph(Driver driver) {
        this.driver = driver;
    }

    public Node createNode(String name, NodeType type, NodeType... types) {
        return createNode(name, name, type, types);
    }

    /**
     * Creates a node of corresponding name and types and returns it.
     *
     * @param name  Node name
     * @param types Node types
     */
    public Node createNode(String name, String shortName, NodeType type, NodeType... types) {
        List <NodeType> nodeTypes = new ArrayList <>(Arrays.asList(types));
        nodeTypes.add(type);
        return submitRequest(String.format("CREATE (n:%s { name: '%s', shortname: '%s' }) RETURN (n)",
                nodeTypes.stream().map(NodeType::getString).collect(Collectors.joining(":")),
                name,
                shortName))
                .list().get(0).get(0).asNode();
    }

    public Node getNode(String name) {
        return submitRequest(String.format("MATCH (n {name: '%s'}) RETURN (n)", name)).list().get(0).get(0).asNode();
    }

    public Node getOrCreateNode(String name, NodeType type, NodeType... types) {
        return getOrCreateNode(name, name, type, types);
    }

    /**
     * Returns the node if it exists, creates it and returns it otherwise.
     * As we use qualified names, each name is unique. Therefore, we can match only on node name.
     * If the node does not exist, it is created with the specified types as labels.
     *
     * @param name  Node name
     * @param types Node types
     */
    public Node getOrCreateNode(String name, String shortName, NodeType type, NodeType... types) {
        List <NodeType> nodeTypes = new ArrayList <>(Arrays.asList(types));
        nodeTypes.add(type);
        return submitRequest(String.format("MERGE (n {name: '%s', shortname: '%s'}) ON CREATE SET n:%s RETURN (n)",
                name,
                shortName,
                nodeTypes.stream().map(NodeType::getString).collect(Collectors.joining(":"))))
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
                "SET c.constructors = cnt -1");
        submitRequest("MATCH (c:CLASS)\n" +
                "WHERE NOT EXISTS(c.constructors)\n" +
                "SET c.constructors = 0");
    }

    /**
     * Creates for all class and interfaces nodes a property nbVariants expressing the number of subclasses it contains.
     */
    public void setNbVariantsProperty() {
        submitRequest("MATCH (c)-[:EXTENDS|:IMPLEMENTS]->(sc:CLASS) WITH count(sc) AS nbVar, c SET c.nbVariants = nbVar");
        submitRequest("MATCH (c) WHERE ((c:CLASS OR c:INTERFACE) AND NOT EXISTS (c.nbVariants)) SET c.nbVariants = 0");
    }

    /**
     * Adds a VP label to the node if it is a VP.
     * A node is a VP if it:
     * - is an abstract class
     * - is an interface
     * - has class or method level variants (subclasses / implementations or methods / constructors overloads)
     * - has a design pattern.
     */
    public void setVPLabels() {
        submitRequest(String.format("MATCH (c) WHERE ((%s) OR c:ABSTRACT OR c:INTERFACE OR (EXISTS(c.nbVariants) AND c.nbVariants > 0) OR c.methods > 0 OR c.constructors > 0) SET c:%s", getClauseForNodesMatchingLabels("c", DesignPatternType.values()), EntityType.VP));
    }

    public void addLabelToNode(Node node, String label) {
        submitRequest(String.format("MATCH (n) WHERE ID(n) = %s SET n:%s RETURN (n)", node.id(), label));
    }

    public int getNbNodesHavingDesignPatterns() {
        return submitRequest(String.format("MATCH (n) WHERE %s RETURN COUNT(n)", getClauseForNodesMatchingLabels("n", DesignPatternType.values())))
                .list().get(0).get(0).asInt();
    }

    public static String getClauseForNodesMatchingLabels(String nodeName, NodeType... types) {
        return Arrays.stream(types).map(nodeType -> nodeName + ":" + nodeType.toString()).collect(Collectors.joining(" OR "));
    }

    public void writeGraphFile(String filePath) {
        writeToFile(filePath, generateJsonGraph());
    }

    public void writeVPGraphFile(String filePath) {
        writeToFile(filePath, generateVPJsonGraph());
    }

    public void writeStatisticsFile(String filePath) {
        writeToFile(filePath, generateStatisticsJson());
    }

    public void writeToFile(String filePath, String content) {
        Path path = Paths.get(filePath);
        try {
            if (path.toFile().getParentFile().exists() || (path.toFile().getParentFile().mkdirs() && path.toFile().createNewFile())) {
                try (BufferedWriter bw = Files.newBufferedWriter(path)) {
                    bw.write(content);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /**
     * Get number of subclasses of a class or implementations of an interface
     *
     * @param node Node corresponding to the class
     *
     * @return Number of subclasses or implementations
     */
    public int getNbVariants(Node node) {
        return submitRequest(String.format("MATCH (c:CLASS)-[:EXTENDS|:IMPLEMENTS]->(c2:CLASS) " +
                "WHERE ID(c) = %s " +
                "RETURN count(c2)", node.id()))
                .list().get(0).get(0).asInt();
    }

    /**
     * Get number of variants at class level.
     * This corresponds to the number of concrete classes without a subclass and extending a class or implementing an interface.
     *
     * @return Number of class level variants
     */
    public int getNbClassLevelVariants() {
        return submitRequest("MATCH (c:CLASS) WHERE (NOT c:ABSTRACT) AND ()-[:EXTENDS|:IMPLEMENTS]->(c) AND (NOT (c)-[:EXTENDS]->()) RETURN (COUNT(c))")
                .list().get(0).get(0).asInt();
    }

    /**
     * Get number of variants at class level.
     * This corresponds to the number of concrete classes without a subclass and extending a class or implementing an interface.
     *
     * @return Number of class level variants
     */
    public int getNbMethodLevelVariants() {
        return getNbMethodVariants() + getNbConstructorVariants();
    }

    /**
     * Get number of variants caused by method overloading.
     * This corresponds to the total number of overloaded methods.
     *
     * @return Number of overloaded methods
     */
    public int getNbMethodVariants() {
        return submitRequest("MATCH (c:CLASS)-->(a:METHOD) MATCH (c:CLASS)-->(b:METHOD)\n" +
                "WHERE a.name = b.name AND ID(a) <> ID(b)\n" +
                "return count(DISTINCT a)")
                .list().get(0).get(0).asInt();
    }

    /**
     * Get number of variants caused by constructor overloading.
     * This corresponds to the total number of constructor overloads.
     *
     * @return Number of constructor overloads
     */
    public int getNbConstructorVariants() {
        return submitRequest("MATCH (c:CLASS)-->(a:CONSTRUCTOR) MATCH (c:CLASS)-->(b:CONSTRUCTOR)\n" +
                "WHERE a.name = b.name AND ID(a) <> ID(b)\n" +
                "return count(DISTINCT a)")
                .list().get(0).get(0).asInt();
    }

    /**
     * Get total number of overloaded constructors
     *
     * @return Number of overloaded constructors
     */
    public int getTotalNbOverloadedConstructors() {
        return submitRequest("MATCH (c:CLASS) RETURN (SUM(c.constructors))")
                .list().get(0).get(0).asInt();
    }

    /**
     * Get total number of overloaded methods
     *
     * @return Number of overloaded methods
     */
    public int getTotalNbOverloadedMethods() {
        return submitRequest("MATCH (c:CLASS) RETURN (SUM(c.methods))")
                .list().get(0).get(0).asInt();
    }

    /**
     * Get total number of method level VPs.
     * These are :
     * - number of methods overloads
     * - number of overloaded constructors
     *
     * @return Number of method level VPs
     */
    public int getNbMethodLevelVPs() {
        return getTotalNbOverloadedMethods() + getTotalNbOverloadedConstructors();
    }

    /**
     * Get total number of class level VPs.
     * These are :
     * - interfaces
     * - abstract classes
     * - extended classes
     *
     * @return Number of class level VPs
     */
    public int getNbClassLevelVPs() {
        int nbInterfaces = submitRequest("MATCH (n:INTERFACE) RETURN COUNT (n)").list().get(0).get(0).asInt();
        int nbAbstractClasses = submitRequest("MATCH (n:CLASS:ABSTRACT) RETURN COUNT (n)").list().get(0).get(0).asInt();
        int nbExtendedClasses = submitRequest("MATCH (n:CLASS)-[r:EXTENDS]->() WHERE NOT n:ABSTRACT RETURN COUNT (n)").list().get(0).get(0).asInt(); // we exclude abstracts as they are already counted
        return nbInterfaces + nbAbstractClasses + nbExtendedClasses;
    }

    private String generateJsonGraph() {
        return String.format("{\"nodes\":[%s],\"links\":[%s]}", getNodesAsJson(false), getLinksAsJson(false));
    }

    private String generateVPJsonGraph() {
        return String.format("{\"nodes\":[%s],\"links\":[%s]}", getNodesAsJson(true), getLinksAsJson(true));
    }

    private String getNodesAsJson(boolean onlyVPs) {
        String request = onlyVPs ?
                "MATCH (c:VP) WHERE c:CLASS OR c:INTERFACE RETURN collect({type:labels(c), name:c.name, shortname:c.shortname, nodeSize:c.methods, intensity:c.constructors, strokeWidth:c.nbVariants})" :
                "MATCH (c) WHERE c:CLASS OR c:INTERFACE RETURN collect({type:labels(c), name:c.name, shortname:c.shortname, nodeSize:c.methods, intensity:c.constructors})";
        return submitRequest(request)
                .list()
                .get(0)
                .get(0)
                .asList(MapAccessor::asMap)
                .stream()
                .map(o -> new JSONObject(o).toString())
                .collect(Collectors.joining(","));
    }

    private String getLinksAsJson(boolean onlyVPs) {
        String request = onlyVPs ?
                "MATCH (c1:VP)-[r:INNER|:EXTENDS|:IMPLEMENTS]->(c2:VP) RETURN collect({source:c1.name, target:c2.name, type:TYPE(r)})" :
                "MATCH (c1)-[r:INNER|:EXTENDS|:IMPLEMENTS]->(c2) RETURN collect({source:c1.name, target:c2.name, type:TYPE(r)})";
        return submitRequest(request)
                .list()
                .get(0)
                .get(0)
                .asList(MapAccessor::asMap)
                .stream()
                .map(o -> new JSONObject(o).toString())
                .collect(Collectors.joining(","));
    }

    public String generateStatisticsJson() {
        return new JSONObject()
                .put("methodsVPs", getTotalNbOverloadedMethods())
                .put("constructorsVPs", getTotalNbOverloadedConstructors())
                .put("methodLevelVPs", getNbMethodLevelVPs())
                .put("classLevelVPs", getNbClassLevelVPs())
                .put("methodsVariants", getNbMethodVariants())
                .put("constructorsVariants", getNbConstructorVariants())
                .put("methodLevelVariants", getNbMethodLevelVariants())
                .put("classLevelVariants", getNbClassLevelVariants()).toString();
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
