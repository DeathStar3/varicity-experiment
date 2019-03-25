import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.driver.v1.types.Node;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Transaction;
import org.neo4j.harness.junit.Neo4jRule;

import static org.junit.Assert.assertEquals;

public class ClassLevelVPsTest extends Neo4JTest {

    @Test
    public void OneInterface() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("Shape", EntityType.INTERFACE);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getNbClassLevelVPs());
                tx.success();
            }
        }
    }

    @Test
    public void OneAbstractClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getNbClassLevelVPs());
                tx.success();
            }
        }
    }

    @Test
    public void OneExtendedClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.EXTENDS);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getNbClassLevelVPs());
                tx.success();
            }
        }
    }

    @Test
    public void OneClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("Shape", EntityType.CLASS);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getNbClassLevelVPs());
                tx.success();
            }
        }
    }

    @Test
    public void NoClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getNbClassLevelVPs());
                tx.success();
            }
        }
    }

    @Test
    public void OneAbstractClassOneInterface() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("Serializable", EntityType.INTERFACE);
            graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getNbClassLevelVPs());
                tx.success();
            }
        }
    }

    @Test
    public void OneExtendedAbstractClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.EXTENDS);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getNbClassLevelVPs());
                tx.success();
            }
        }
    }

    @Test
    public void OneExtendedInterface() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.INTERFACE);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.IMPLEMENTS);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getNbClassLevelVPs());
                tx.success();
            }
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
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getNbClassLevelVPs());
                tx.success();
            }
        }
    }
}