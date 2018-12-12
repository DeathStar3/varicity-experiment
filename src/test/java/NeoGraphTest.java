import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.graphdb.*;
import org.neo4j.harness.junit.Neo4jRule;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class NeoGraphTest {

    @Rule
    public Neo4jRule neo4jRule = new Neo4jRule();
    private GraphDatabaseService graphDatabaseService;

    @Before
    public void setUp() throws Exception {
        graphDatabaseService = neo4jRule.getGraphDatabaseService();
    }

    @After
    public void tearDown() throws Exception {
        graphDatabaseService.shutdown();
    }

    @Test
    public void createNode() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            NeoGraph.NodeType nodeType = NeoGraph.NodeType.CLASS;
            graph.createNode("n", nodeType);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                ResourceIterable <Node> allNodes = graphDatabaseService.getAllNodes();
                assertEquals(1, allNodes.stream().count());
                Optional <Node> optionalNode = allNodes.stream().findFirst();
                assertTrue(optionalNode.isPresent());
                assertTrue(optionalNode.get().hasLabel(Label.label(nodeType.toString())));
                // TODO: 11/29/18 Check name
                tx.success();
            }
        }
    }

    @Test
    public void linkTwoNodes() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node node1 = graph.createNode("n1", NeoGraph.NodeType.CLASS);
            org.neo4j.driver.v1.types.Node node2 = graph.createNode("n2", NeoGraph.NodeType.METHOD);
            NeoGraph.RelationType relationType = NeoGraph.RelationType.METHOD;
            graph.linkTwoNodes(node1, node2, relationType);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                ResourceIterable <Node> allNodes = graphDatabaseService.getAllNodes();
                assertEquals(2, allNodes.stream().count());
                ResourceIterable <Relationship> allRelationships = graphDatabaseService.getAllRelationships();
                assertEquals(1, allRelationships.stream().count());
                Optional <Relationship> optionalRelationship = allRelationships.stream().findFirst();
                assertTrue(optionalRelationship.isPresent());
                assertTrue(optionalRelationship.get().isType(RelationshipType.withName(relationType.toString())));
                tx.success();
            }
        }
    }

    @Test
    public void setMethodsOverloads() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node nodeClass1 = graph.createNode("class", NeoGraph.NodeType.CLASS);
            org.neo4j.driver.v1.types.Node nodeMethod1 = graph.createNode("method1", NeoGraph.NodeType.METHOD);
            org.neo4j.driver.v1.types.Node nodeMethod11 = graph.createNode("method1", NeoGraph.NodeType.METHOD);
            org.neo4j.driver.v1.types.Node nodeMethod2 = graph.createNode("method2", NeoGraph.NodeType.METHOD);
            NeoGraph.RelationType relationType = NeoGraph.RelationType.METHOD;
            graph.linkTwoNodes(nodeClass1, nodeMethod1, relationType);
            graph.linkTwoNodes(nodeClass1, nodeMethod11, relationType);
            graph.linkTwoNodes(nodeClass1, nodeMethod2, relationType);
            graph.setMethodsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                List <Node> allNodes = graphDatabaseService.getAllNodes().stream()
                        .filter(node -> node.hasLabel(Label.label(NeoGraph.NodeType.CLASS.toString())))
                        .collect(Collectors.toList());
                assertEquals(1, allNodes.size());
                Node classNode = allNodes.get(0);
                assertTrue(classNode.getAllProperties().containsKey("methods"));
                assertEquals(1L, classNode.getProperty("methods"));
                tx.success();
            }
        }
    }

    @Test
    public void setConstructorsOverloads() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node nodeClass1 = graph.createNode("class", NeoGraph.NodeType.CLASS);
            org.neo4j.driver.v1.types.Node nodeConstructor1 = graph.createNode("constructor", NeoGraph.NodeType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node nodeConstructor11 = graph.createNode("constructor", NeoGraph.NodeType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node nodeMethod = graph.createNode("method", NeoGraph.NodeType.METHOD);
            NeoGraph.RelationType relationType = NeoGraph.RelationType.METHOD;
            graph.linkTwoNodes(nodeClass1, nodeConstructor1, relationType);
            graph.linkTwoNodes(nodeClass1, nodeConstructor11, relationType);
            graph.linkTwoNodes(nodeClass1, nodeMethod, relationType);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                List <Node> allNodes = graphDatabaseService.getAllNodes().stream()
                        .filter(node -> node.hasLabel(Label.label(NeoGraph.NodeType.CLASS.toString())))
                        .collect(Collectors.toList());
                assertEquals(1, allNodes.size());
                Node classNode = allNodes.get(0);
                assertTrue(classNode.getAllProperties().containsKey("constructors"));
                assertEquals(2L, classNode.getProperty("constructors"));
                tx.success();
            }
        }
    }

    @Test
    public void getOrCreateNode() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            NeoGraph.NodeType nodeType = NeoGraph.NodeType.CLASS;
            for (int i = 0 ; i < 2 ; i++) {
                graph.getOrCreateNode("n", nodeType);
                try (Transaction tx = graphDatabaseService.beginTx()) {
                    ResourceIterable <Node> allNodes = graphDatabaseService.getAllNodes();
                    assertEquals(1, allNodes.stream().count());
                    Optional <Node> optionalNode = allNodes.stream().findFirst();
                    assertTrue(optionalNode.isPresent());
                    assertTrue(optionalNode.get().hasLabel(Label.label(nodeType.toString())));
                    // TODO: 11/29/18 Check name
                    tx.success();
                }
            }
        }
    }

    @Test
    public void deleteGraph() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.deleteGraph();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                ResourceIterable <Node> allNodes = graphDatabaseService.getAllNodes();
                assertEquals(0, allNodes.stream().count());
                tx.success();
            }
        }
    }

    @Test
    public void addLabelToNode() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node node = graph.createNode("class", NeoGraph.NodeType.CLASS);
            graph.addLabelToNode(node, NeoGraph.NodeType.STRATEGY.toString());
            try (Transaction tx = graphDatabaseService.beginTx()) {
                Node nodeFromGraph = graphDatabaseService.getNodeById(node.id());
                assertTrue(nodeFromGraph.hasLabel(Label.label(NeoGraph.NodeType.CLASS.toString())));
                assertTrue(nodeFromGraph.hasLabel(Label.label(NeoGraph.NodeType.STRATEGY.toString())));
                tx.success();
            }
        }
    }

    @Test
    public void getNbSubclasses() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node nodeClass = graph.createNode("class", NeoGraph.NodeType.CLASS);
            org.neo4j.driver.v1.types.Node nodeSubclass1 = graph.createNode("subclass1", NeoGraph.NodeType.CLASS);
            org.neo4j.driver.v1.types.Node nodeSubclass2 = graph.createNode("subclass2", NeoGraph.NodeType.CLASS);
            NeoGraph.RelationType relationType = NeoGraph.RelationType.EXTENDS;
            graph.linkTwoNodes(nodeClass, nodeSubclass1, relationType);
            graph.linkTwoNodes(nodeClass, nodeSubclass2, relationType);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getNbSubclasses(nodeClass));
                assertEquals(0, graph.getNbSubclasses(nodeSubclass1));
                assertEquals(0, graph.getNbSubclasses(nodeSubclass2));
                tx.success();
            }
        }
    }

}