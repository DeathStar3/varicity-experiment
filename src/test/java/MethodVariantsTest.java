import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.driver.v1.types.Node;
import org.neo4j.graphdb.Transaction;

import static org.junit.Assert.assertEquals;

public class MethodVariantsTest extends Neo4JTest {

    @Test
    public void OneClassNoMethodVariant() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node drawMethod = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getNbMethodVariants());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassTwoMethodVariants() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node drawMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawMethod2 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod2, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getNbMethodVariants());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassThreeMethodVariants() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node drawMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawMethod2 = graph.createNode("draw", EntityType.METHOD);
            Node drawMethod3 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod2, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod3, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(3, graph.getNbMethodVariants());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassOneOverloadedMethod() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node drawMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node displayMethod1 = graph.createNode("display", EntityType.METHOD);
            Node displayMethod2 = graph.createNode("display", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, displayMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, displayMethod2, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getNbMethodVariants());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassTwoOverloadedMethodsAndNoVariantMethod() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node drawMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node displayMethod1 = graph.createNode("display", EntityType.METHOD);
            Node displayMethod2 = graph.createNode("display", EntityType.METHOD);
            Node showMethod1 = graph.createNode("show", EntityType.METHOD);
            Node showMethod2 = graph.createNode("show", EntityType.METHOD);
            Node showMethod3 = graph.createNode("show", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, displayMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, displayMethod2, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, showMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, showMethod2, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, showMethod3, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(5, graph.getNbMethodVariants());
                tx.success();
            }
        }
    }


    @Test
    public void TwoClassesNoMethodVariant() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node drawRectangleMethod = graph.createNode("draw", EntityType.METHOD);
            Node drawCircleMethod = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawRectangleMethod, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, drawCircleMethod, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getNbMethodVariants());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesTwoMethodVariants() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node drawRectangleMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawRectangleMethod2 = graph.createNode("draw", EntityType.METHOD);
            Node drawCircleMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawCircleMethod2 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawRectangleMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawRectangleMethod2, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, drawCircleMethod1, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, drawCircleMethod2, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(4, graph.getNbMethodVariants());
                tx.success();
            }
        }
    }


    @Test
    public void TwoClassesTwoMethodVariantsWithNoVariantMethod() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node displayRectangleMethod = graph.createNode("display", EntityType.METHOD);
            Node drawRectangleMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawRectangleMethod2 = graph.createNode("draw", EntityType.METHOD);
            Node displayCircleMethod = graph.createNode("display", EntityType.METHOD);
            Node drawCircleMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawCircleMethod2 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, displayRectangleMethod, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawRectangleMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawRectangleMethod2, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, displayCircleMethod, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, drawCircleMethod1, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, drawCircleMethod2, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(4, graph.getNbMethodVariants());
                tx.success();
            }
        }
    }
}