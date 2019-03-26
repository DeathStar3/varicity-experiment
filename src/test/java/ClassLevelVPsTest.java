import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.types.Node;

import static org.junit.Assert.assertEquals;

public class ClassLevelVPsTest extends Neo4JTest {

    @Test
    public void OneInterface() {
        runTest(graph -> {
            graph.createNode("Shape", EntityType.INTERFACE);
            assertEquals(1, graph.getNbClassLevelVPs());
        });
    }

    @Test
    public void OneAbstractClass() {
        runTest(graph -> {
            graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            assertEquals(1, graph.getNbClassLevelVPs());
        });
    }

    @Test
    public void OneExtendedClass() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.EXTENDS);
            assertEquals(1, graph.getNbClassLevelVPs());
        });
    }

    @Test
    public void OneClass() {
        runTest(graph -> {
            graph.createNode("Shape", EntityType.CLASS);
            assertEquals(0, graph.getNbClassLevelVPs());
        });
    }

    @Test
    public void NoClass() {
        runTest(graph -> {
            assertEquals(0, graph.getNbClassLevelVPs());
        });
    }

    @Test
    public void OneAbstractClassOneInterface() {
        runTest(graph -> {
            graph.createNode("Serializable", EntityType.INTERFACE);
            graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            assertEquals(2, graph.getNbClassLevelVPs());
        });
    }

    @Test
    public void OneExtendedAbstractClass() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.EXTENDS);
            assertEquals(1, graph.getNbClassLevelVPs());
        });
    }

    @Test
    public void OneExtendedInterface() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.INTERFACE);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.IMPLEMENTS);
            assertEquals(1, graph.getNbClassLevelVPs());
        });
    }

    @Test
    public void TwoLevelsClassVP() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.ABSTRACT, EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node smallCircleClass = graph.createNode("SmallCircle", EntityType.CLASS);
            graph.linkTwoNodes(shapeClass, circleClass, RelationType.EXTENDS);
            graph.linkTwoNodes(circleClass, smallCircleClass, RelationType.EXTENDS);
            assertEquals(2, graph.getNbClassLevelVPs());
        });
    }
}