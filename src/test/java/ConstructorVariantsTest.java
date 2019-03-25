import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.driver.v1.types.Node;
import org.neo4j.graphdb.Transaction;

import static org.junit.Assert.assertEquals;

public class ConstructorVariantsTest extends Neo4JTest {

    @Test
    public void OneClassNoConstructorVariant() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getNbConstructorVariants());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassTwoConstructorVariants() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor1 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor2 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor2, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getNbConstructorVariants());
                tx.success();
            }
        }
    }

    @Test
    public void OneClassThreeConstructorVariants() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor1 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor2 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor3 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor3, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(3, graph.getNbConstructorVariants());
                tx.success();
            }
        }
    }

   @Test
    public void TwoClassesNoConstructorVariant() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node circleConstructor = graph.createNode("Circle", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, circleConstructor, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(0, graph.getNbConstructorVariants());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesOneConstructorVariant() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor1 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor2 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node circleConstructor = graph.createNode("Circle", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, circleConstructor, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(2, graph.getNbConstructorVariants());
                tx.success();
            }
        }
    }

    @Test
    public void TwoClassesTwoConstructorVariants() {
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node rectangleConstructor1 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor2 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node circleConstructor1 = graph.createNode("Circle", EntityType.CONSTRUCTOR);
            Node circleConstructor2 = graph.createNode("Circle", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, circleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, circleConstructor2, RelationType.METHOD);
            try (Transaction tx = graphDatabaseService.beginTx()) {
                assertEquals(4, graph.getNbConstructorVariants());
                tx.success();
            }
        }
    }

}
