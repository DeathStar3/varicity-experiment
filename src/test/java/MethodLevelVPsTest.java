import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.driver.v1.types.Node;
import org.neo4j.graphdb.Transaction;

import static org.junit.Assert.assertEquals;

public class MethodLevelVPsTest extends Neo4JTest {

    @Test
    public void NoMethodOverloadNoConstructorOverload() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node displayMethod = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            assertEquals(0, graph.getNbMethodLevelVPs());
        }
    }

    @Test
    public void OneMethodOverloadNoConstructorOverload() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node displayMethod1 = graph.createNode("display", EntityType.METHOD);
            Node displayMethod2 = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod1, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod2, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            assertEquals(1, graph.getNbMethodLevelVPs());
         }
    }

    @Test
    public void NoMethodOverloadOneConstructorOverload() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node displayMethod = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor1, relationType);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            assertEquals(1, graph.getNbMethodLevelVPs());
            try (Transaction tx = graphDatabaseService.beginTx()) {
                tx.success();
            }
        }
    }

    @Test
    public void OneMethodOverloadOneConstructorOverload() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node displayMethod1 = graph.createNode("display", EntityType.METHOD);
            Node displayMethod2 = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor1, relationType);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod1, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod2, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            assertEquals(2, graph.getNbMethodLevelVPs());
        }
    }

}