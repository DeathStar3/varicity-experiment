import neo4j_types.EntityType;
import neo4j_types.RelationType;
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

public class ConstructorOverloadsTest extends Neo4JTest {

    @Test
    public void OneClassNoConstructorOverload() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor, RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getTotalNbOverloadedConstructors());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassOneConstructorOverload() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getTotalNbOverloadedConstructors());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassTwoConstructorOverloads() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor3 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor3, RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getTotalNbOverloadedConstructors());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesNoConstructorOverload() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node polygonClass = graph.createNode("Polygon", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonConstructor = graph.createNode("Polygon", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor, RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getTotalNbOverloadedConstructors());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesOneConstructorOverload() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node polygonClass = graph.createNode("Polygon", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonConstructor = graph.createNode("Polygon", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor, RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getTotalNbOverloadedConstructors());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesTwoConstructorOverloads() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node polygonClass = graph.createNode("Polygon", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node polygonConstructor1 = graph.createNode("Polygon", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node polygonConstructor2 = graph.createNode("Polygon", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor2, RelationType.METHOD);
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getTotalNbOverloadedConstructors());
                tx.success();
            }
        }
    }

}