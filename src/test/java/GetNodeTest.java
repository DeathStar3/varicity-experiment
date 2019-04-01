import neo4j_types.EntityType;
import org.junit.Test;
import org.neo4j.driver.v1.types.Node;

import java.util.Optional;

import static org.junit.Assert.*;

public class GetNodeTest extends Neo4JTest {

    @Test
    public void getNodeInRealPackage(){
        runTest(graph -> {
            Node classNode = graph.createNode("fr.unice.i3s.TestClass", EntityType.CLASS);
            Optional <Node> foundNode = graph.getNodeWithNameInPackage("TestClass", "fr.unice.i3s");
            assertTrue(foundNode.isPresent());
            assertEquals(classNode, foundNode.get());
        });
    }

    @Test
    public void getNodeInUpperPackage(){
        runTest(graph -> {
            Node classNode = graph.createNode("fr.unice.i3s.TestClass", EntityType.CLASS);
            Optional <Node> foundNode = graph.getNodeWithNameInPackage("TestClass", "fr.unice");
            assertTrue(foundNode.isPresent());
            assertEquals(classNode, foundNode.get());
        });
    }

    @Test
    public void inexistantClassName(){
        runTest(graph -> {
            graph.createNode("fr.unice.i3s.TestClass", EntityType.CLASS);
            Optional <Node> foundNode = graph.getNodeWithNameInPackage("Test", "fr.unice");
            assertFalse(foundNode.isPresent());
        });
    }

    @Test
    public void inexistantPackage(){
        runTest(graph -> {
            graph.createNode("fr.unice.i3s.TestClass", EntityType.CLASS);
            Optional <Node> foundNode = graph.getNodeWithNameInPackage("TestClass", "fr.i3s");
            assertFalse(foundNode.isPresent());
        });
    }

    @Test
    public void incompletePackage(){
        runTest(graph -> {
            graph.createNode("fr.unice.i3s.TestClass", EntityType.CLASS);
            Optional <Node> foundNode = graph.getNodeWithNameInPackage("TestClass", "fr.uni");
            assertFalse(foundNode.isPresent());
        });
    }

}
