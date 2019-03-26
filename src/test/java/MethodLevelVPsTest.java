import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.types.Node;

import static org.junit.Assert.assertEquals;

public class MethodLevelVPsTest extends Neo4JTest {

    @Test
    public void NoMethodOverloadNoConstructorOverload() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node displayMethod = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            assertEquals(0, graph.getNbMethodLevelVPs());
        });
    }

    @Test
    public void OneMethodOverloadNoConstructorOverload() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node displayMethod1 = graph.createNode("display", EntityType.METHOD);
            Node displayMethod2 = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod1, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod2, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            assertEquals(1, graph.getNbMethodLevelVPs());
        });
    }

    @Test
    public void NoMethodOverloadOneConstructorOverload() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node displayMethod = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor1, relationType);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            assertEquals(1, graph.getNbMethodLevelVPs());
        });
    }

    @Test
    public void OneMethodOverloadOneConstructorOverload() {
        runTest(graph -> {
            Node shapeClass = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructor1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node shapeConstructor2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node displayMethod1 = graph.createNode("display", EntityType.METHOD);
            Node displayMethod2 = graph.createNode("display", EntityType.METHOD);
            RelationType relationType = RelationType.METHOD;
            graph.linkTwoNodes(shapeClass, shapeConstructor1, relationType);
            graph.linkTwoNodes(shapeClass, shapeConstructor2, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod1, relationType);
            graph.linkTwoNodes(shapeClass, displayMethod2, relationType);
            graph.setMethodsOverloads();
            graph.setConstructorsOverloads();
            assertEquals(2, graph.getNbMethodLevelVPs());
        });
    }

}