import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.driver.v1.types.Node;

import static org.junit.Assert.assertEquals;

public class ClassLevelVPsTest extends Neo4JTest {

    @Test
    public void OneInterface() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("Shape", EntityType.INTERFACE);
            assertEquals(1, graph.getNbClassLevelVPs());
         }
    }

    @Test
    public void OneAbstractClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            assertEquals(1, graph.getNbClassLevelVPs());
        }
    }

    @Test
    public void OneExtendedClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.EXTENDS);
            assertEquals(1, graph.getNbClassLevelVPs());
        }
    }

    @Test
    public void OneClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("Shape", EntityType.CLASS);
            assertEquals(0, graph.getNbClassLevelVPs());
        }
    }

    @Test
    public void NoClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            assertEquals(0, graph.getNbClassLevelVPs());
        }
    }

    @Test
    public void OneAbstractClassOneInterface() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("Serializable", EntityType.INTERFACE);
            graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            assertEquals(2, graph.getNbClassLevelVPs());
        }
    }

    @Test
    public void OneExtendedAbstractClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.EXTENDS);
            assertEquals(1, graph.getNbClassLevelVPs());
        }
    }

    @Test
    public void OneExtendedInterface() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.INTERFACE);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.IMPLEMENTS);
            assertEquals(1, graph.getNbClassLevelVPs());
        }
    }

    @Test
    public void TwoLevelsClassVP() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node smallCircleClass = graph.createNode("SmallCircle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.EXTENDS);
            graph.linkTwoNodes(circleClass, smallCircleClass, RelationType.EXTENDS);
            assertEquals(2, graph.getNbClassLevelVPs());
        }
    }
}