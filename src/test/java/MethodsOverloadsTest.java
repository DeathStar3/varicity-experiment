import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.graphdb.Transaction;

import static org.junit.Assert.assertEquals;

public class MethodsOverloadsTest extends Neo4JTest {

    @Test
    public void OneClassNoMethodOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node nodeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node nodeMethod1 = graph.createNode("draw", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node nodeMethod2 = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
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
            org.neo4j.driver.v1.types.Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeMethod1 = graph.createNode("draw", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node shapeMethod2 = graph.createNode("display", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonNode = graph.createNode("Polygon", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonMethod1 = graph.createNode("draw", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonMethod2 = graph.createNode("display", EntityType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod1, RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod2, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod1, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod2, RelationType.METHOD);
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
            org.neo4j.driver.v1.types.Node nodeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node nodeMethod1 = graph.createNode("draw", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node nodeMethod2 = graph.createNode("draw", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
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
            org.neo4j.driver.v1.types.Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeMethod1 = graph.createNode("draw", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node shapeMethod2 = graph.createNode("draw", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonNode = graph.createNode("Polygon", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonMethod1 = graph.createNode("draw", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonMethod2 = graph.createNode("display", EntityType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod1, RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod2, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod1, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod2, RelationType.METHOD);
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
            org.neo4j.driver.v1.types.Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeMethod1 = graph.createNode("draw", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node shapeMethod2 = graph.createNode("draw", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonNode = graph.createNode("Polygon", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonMethod1 = graph.createNode("draw", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node polygonMethod2 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod1, RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod2, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod1, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod2, RelationType.METHOD);
            graph.setMethodsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getTotalNbMethodsOverloads());
                tx.success();
            }
        }
    }

}