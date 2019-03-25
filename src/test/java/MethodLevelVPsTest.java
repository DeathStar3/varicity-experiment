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

public class MethodLevelVPsTest extends Neo4JTest {

    @Test
    public void NoMethodOverloadNoConstructorOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node displayMethod = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getNbMethodLevelVPs());
                tx.success();
            }
        }
    }

    @Test
    public void OneMethodOverloadNoConstructorOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node displayMethod1 = graph.createNode("display", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node displayMethod2 = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod1, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod2, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getNbMethodLevelVPs());
                tx.success();
            }
        }
    }

    @Test
    public void NoMethodOverloadOneConstructorOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node displayMethod = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor1, relationType);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getNbMethodLevelVPs());
                tx.success();
            }
        }
    }

    @Test
    public void OneMethodOverloadOneConstructorOverload(){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            org.neo4j.driver.v1.types.Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            org.neo4j.driver.v1.types.Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            org.neo4j.driver.v1.types.Node displayMethod1 = graph.createNode("display", EntityType.METHOD);
            org.neo4j.driver.v1.types.Node displayMethod2 = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor1, relationType);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod1, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod2, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getNbMethodLevelVPs());
                tx.success();
            }
        }
    }

}