import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Transaction;
import org.neo4j.harness.junit.Neo4jRule;

import static org.junit.Assert.assertEquals;

public class ConstructorOverloadsTest {

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
    public void OneClassNoConstructorOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor, NeoGraph.RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getTotalNbConstructorsOverloads());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassOneConstructorOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor2 = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, NeoGraph.RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getTotalNbConstructorsOverloads());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassTwoConstructorOverloads(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor2 = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor3 = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor3, NeoGraph.RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getTotalNbConstructorsOverloads());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesNoConstructorOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node polygonClass = graph.createNode("Polygon", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonConstructor = graph.createNode("Polygon", NeoGraph.EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor, NeoGraph.RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getTotalNbConstructorsOverloads());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesOneConstructorOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor2 = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node polygonClass = graph.createNode("Polygon", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonConstructor = graph.createNode("Polygon", NeoGraph.EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor, NeoGraph.RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getTotalNbConstructorsOverloads());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesTwoConstructorOverloads(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor2 = graph.createNode("Shape", NeoGraph.EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node polygonClass = graph.createNode("Polygon", NeoGraph.EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonConstructor1 = graph.createNode("Polygon", NeoGraph.EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node polygonConstructor2 = graph.createNode("Polygon", NeoGraph.EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor1, NeoGraph.RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor2, NeoGraph.RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getTotalNbConstructorsOverloads());
                tx.success();
            }
        }
    }

}