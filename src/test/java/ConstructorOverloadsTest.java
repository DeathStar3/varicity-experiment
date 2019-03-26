import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.types.Node;

import static org.junit.Assert.assertEquals;

public class ConstructorOverloadsTest extends Neo4JTest {

    @Test
    public void OneClassNoConstructorOverload() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor, RelationType.METHOD);
            graph.setConstructorsOverloads();
            assertEquals(0, graph.getTotalNbOverloadedConstructors());
        });
    }

    @Test
    public void OneClassOneConstructorOverload() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, RelationType.METHOD);
            graph.setConstructorsOverloads();
            assertEquals(1, graph.getTotalNbOverloadedConstructors());
        });
    }

    @Test
    public void OneClassTwoConstructorOverloads() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node shapeConstructor3 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor3, RelationType.METHOD);
            graph.setConstructorsOverloads();
            assertEquals(2, graph.getTotalNbOverloadedConstructors());
        });
    }

    @Test
    public void TwoClassesNoConstructorOverload() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node polygonClass = graph.createNode("Polygon", EntityType.CLASS);
            Node polygonConstructor = graph.createNode("Polygon", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor, RelationType.METHOD);
            graph.setConstructorsOverloads();
            assertEquals(0, graph.getTotalNbOverloadedConstructors());
        });
    }

    @Test
    public void TwoClassesOneConstructorOverload() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node polygonClass = graph.createNode("Polygon", EntityType.CLASS);
            Node polygonConstructor = graph.createNode("Polygon", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor, RelationType.METHOD);
            graph.setConstructorsOverloads();
            assertEquals(1, graph.getTotalNbOverloadedConstructors());
        });
    }

    @Test
    public void TwoClassesTwoConstructorOverloads() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node polygonClass = graph.createNode("Polygon", EntityType.CLASS);
            Node polygonConstructor1 = graph.createNode("Polygon", EntityType.CONSTRUCTOR);
            Node polygonConstructor2 = graph.createNode("Polygon", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeClass, shapeConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(polygonClass, polygonConstructor2, RelationType.METHOD);
            graph.setConstructorsOverloads();
            assertEquals(2, graph.getTotalNbOverloadedConstructors());
        });
    }

}