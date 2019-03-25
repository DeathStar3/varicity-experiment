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

import static org.junit.Assert.*;

public class MethodsOverloadsTest {

    @Rule
    public Neo4jRule neo4jRule = new Neo4jRule();
    private GraphDatabaseService graphDatabaseService;

    @Before
    public void setUp() {
        graphDatabaseService = neo4jRule.getGraphDatabaseService();
    }

    @After
    public void tearDown() {
        graphDatabaseService.shutdown();
    }

    @Test
    public void OneClassNoMethodOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node nodeClass = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node nodeMethod1 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node nodeMethod2 = graph.createNode("display", NeoGraph.EntityType.METHOD);
            NeoGraph.RelationType relationType = NeoGraph.RelationType.METHOD;
            graph.linkTwoNodes(nodeClass, nodeMethod1, relationType);
            graph.linkTwoNodes(nodeClass, nodeMethod2, relationType);
            graph.setMethodsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getTotalNbMethodsOverloads());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesNoMethodOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeNode = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeMethod1 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node shapeMethod2 = graph.createNode("display", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonNode = graph.createNode("Polygon", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonMethod1 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonMethod2 = graph.createNode("display", NeoGraph.EntityType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod2, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod2, NeoGraph.RelationType.METHOD);
            graph.setMethodsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getTotalNbMethodsOverloads());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassOneMethodOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node nodeClass = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node nodeMethod1 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node nodeMethod2 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            NeoGraph.RelationType relationType = NeoGraph.RelationType.METHOD;
            graph.linkTwoNodes(nodeClass, nodeMethod1, relationType);
            graph.linkTwoNodes(nodeClass, nodeMethod2, relationType);
            graph.setMethodsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getTotalNbMethodsOverloads());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesOneMethodOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeNode = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeMethod1 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node shapeMethod2 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonNode = graph.createNode("Polygon", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonMethod1 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonMethod2 = graph.createNode("display", NeoGraph.EntityType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod2, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod2, NeoGraph.RelationType.METHOD);
            graph.setMethodsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getTotalNbMethodsOverloads());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesTwoMethodOverloads(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeNode = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeMethod1 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node shapeMethod2 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonNode = graph.createNode("Polygon", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonMethod1 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonMethod2 = graph.createNode("draw", NeoGraph.EntityType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod2, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod2, NeoGraph.RelationType.METHOD);
            graph.setMethodsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getTotalNbMethodsOverloads());
                tx.success();
            }
        }
    }

}