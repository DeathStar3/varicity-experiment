import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.types.Node;

import static org.junit.Assert.assertEquals;

public class ConstructorVariantsTest extends Neo4JTest {

    @Test
    public void OneClassNoConstructorVariant() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor, RelationType.METHOD);
            assertEquals(0, graph.getNbConstructorVariants());
        });
    }

    @Test
    public void OneClassTwoConstructorVariants() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor1 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor2 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor2, RelationType.METHOD);
            assertEquals(2, graph.getNbConstructorVariants());
        });
    }

    @Test
    public void OneClassThreeConstructorVariants() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor1 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor2 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor3 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor3, RelationType.METHOD);
            assertEquals(3, graph.getNbConstructorVariants());
        });
    }

   @Test
    public void TwoClassesNoConstructorVariant() {
       runTest(graph -> {
           Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
           Node rectangleConstructor = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
           Node circleClass = graph.createNode("Circle", EntityType.CLASS);
           Node circleConstructor = graph.createNode("Circle", EntityType.METHOD);
           graph.linkTwoNodes(rectangleClass, rectangleConstructor, RelationType.METHOD);
           graph.linkTwoNodes(circleClass, circleConstructor, RelationType.METHOD);
           assertEquals(0, graph.getNbConstructorVariants());
       });
    }

    @Test
    public void TwoClassesOneConstructorVariant() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor1 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor2 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node circleConstructor = graph.createNode("Circle", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, circleConstructor, RelationType.METHOD);
            assertEquals(2, graph.getNbConstructorVariants());
        });
    }

    @Test
    public void TwoClassesTwoConstructorVariants() {
        runTest(graph -> {
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
            assertEquals(4, graph.getNbConstructorVariants());
        });
    }

}
