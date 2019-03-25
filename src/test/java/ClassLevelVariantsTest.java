import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.driver.v1.types.Node;
import org.neo4j.graphdb.Transaction;

import static org.junit.Assert.assertEquals;

public class ClassLevelVariantsTest extends Neo4JTest {

    @Test
    public void NoSubclass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("Shape", EntityType.CLASS, EntityType.ABSTRACT);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getNbClassLevelVariants());
                tx.success();
            }
        }
    }

    @Test
    public void OneConcreteClass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("Shape", EntityType.CLASS);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getNbClassLevelVariants());
                tx.success();
            }
        }
    }

    @Test
    public void OneSubclass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS, EntityType.ABSTRACT);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.EXTENDS);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(1, graph.getNbClassLevelVariants());
                tx.success();
            }
        }
    }

    @Test
    public void ThreeSubclasses() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS, EntityType.ABSTRACT);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node triangleClass = graph.createNode("Triangle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeClass, rectangleClass, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeClass, triangleClass, RelationType.EXTENDS);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(3, graph.getNbClassLevelVariants());
                tx.success();
            }
        }
    }

    // TODO: 3/25/19 determine if we should detect a variant or not
    @Test
    public void OneAbstractSubclass() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS, EntityType.ABSTRACT);
            Node polygonClass = graph.createNode("Polygon", EntityType.CLASS, EntityType.ABSTRACT);
            graph.linkTwoNodes(shapeClass, polygonClass, RelationType.EXTENDS);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getNbClassLevelVariants());
                tx.success();
            }
        }
    }
}
