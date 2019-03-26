import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.types.Node;

import static org.junit.Assert.assertEquals;

public class MethodVariantsTest extends Neo4JTest {

    @Test
    public void OneClassNoMethodVariant() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node drawMethod = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod, RelationType.METHOD);
            assertEquals(0, graph.getNbMethodVariants());
        });
    }

    @Test
    public void OneClassTwoMethodVariants() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node drawMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawMethod2 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod2, RelationType.METHOD);
            assertEquals(2, graph.getNbMethodVariants());
        });
    }

    @Test
    public void OneClassThreeMethodVariants() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node drawMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawMethod2 = graph.createNode("draw", EntityType.METHOD);
            Node drawMethod3 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod2, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod3, RelationType.METHOD);
            assertEquals(3, graph.getNbMethodVariants());
        });
    }

    @Test
    public void OneClassOneOverloadedMethod() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node drawMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node displayMethod1 = graph.createNode("display", EntityType.METHOD);
            Node displayMethod2 = graph.createNode("display", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, displayMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, displayMethod2, RelationType.METHOD);
            assertEquals(2, graph.getNbMethodVariants());
        });
    }

    @Test
    public void OneClassTwoOverloadedMethodsAndNoVariantMethod() {
        runTest(graph -> {
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
            assertEquals(5, graph.getNbMethodVariants());
        });
    }


    @Test
    public void TwoClassesNoMethodVariant() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node drawRectangleMethod = graph.createNode("draw", EntityType.METHOD);
            Node drawCircleMethod = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawRectangleMethod, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, drawCircleMethod, RelationType.METHOD);
            assertEquals(0, graph.getNbMethodVariants());
        });
    }

    @Test
    public void TwoClassesTwoMethodVariants() {
        runTest(graph -> {
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
            assertEquals(4, graph.getNbMethodVariants());
        });
    }


    @Test
    public void TwoClassesTwoMethodVariantsWithNoVariantMethod() {
        runTest(graph -> {
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
            assertEquals(4, graph.getNbMethodVariants());
        });
    }
}
