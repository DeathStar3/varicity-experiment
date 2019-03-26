import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.types.Node;

import static org.junit.Assert.assertEquals;

public class MethodsOverloadsTest extends Neo4JTest {

    @Test
    public void OneClassNoMethodOverload(){
        runTest(graph -> {
            Node nodeClass = graph.createNode("Shape", EntityType.CLASS);
            Node nodeMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node nodeMethod2 = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(nodeClass, nodeMethod1, relationType);
            graph.linkTwoNodes(nodeClass, nodeMethod2, relationType);
            graph.setMethodsOverloads();
            assertEquals(0, graph.getTotalNbOverloadedMethods());
        });
    }

    @Test
    public void TwoClassesNoMethodOverload(){
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node shapeMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node shapeMethod2 = graph.createNode("display", EntityType.METHOD);
            Node polygonNode = graph.createNode("Polygon", EntityType.CLASS);
            Node polygonMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node polygonMethod2 = graph.createNode("display", EntityType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod1, RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod2, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod1, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod2, RelationType.METHOD);
            graph.setMethodsOverloads();
            assertEquals(0, graph.getTotalNbOverloadedMethods());
        });
    }

    @Test
    public void OneClassOneMethodOverload(){
        runTest(graph -> {
            Node nodeClass = graph.createNode("Shape", EntityType.CLASS);
            Node nodeMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node nodeMethod2 = graph.createNode("draw", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(nodeClass, nodeMethod1, relationType);
            graph.linkTwoNodes(nodeClass, nodeMethod2, relationType);
            graph.setMethodsOverloads();
            assertEquals(1, graph.getTotalNbOverloadedMethods());
        });
    }

    @Test
    public void TwoClassesOneMethodOverload(){
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node shapeMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node shapeMethod2 = graph.createNode("draw", EntityType.METHOD);
            Node polygonNode = graph.createNode("Polygon", EntityType.CLASS);
            Node polygonMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node polygonMethod2 = graph.createNode("display", EntityType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod1, RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod2, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod1, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod2, RelationType.METHOD);
            graph.setMethodsOverloads();
            assertEquals(1, graph.getTotalNbOverloadedMethods());
        });
    }

    @Test
    public void TwoClassesTwoMethodOverloads(){
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node shapeMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node shapeMethod2 = graph.createNode("draw", EntityType.METHOD);
            Node polygonNode = graph.createNode("Polygon", EntityType.CLASS);
            Node polygonMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node polygonMethod2 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod1, RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeMethod2, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod1, RelationType.METHOD);
            graph.linkTwoNodes(polygonNode, polygonMethod2, RelationType.METHOD);
            graph.setMethodsOverloads();
            assertEquals(2, graph.getTotalNbOverloadedMethods());
        });
    }

}