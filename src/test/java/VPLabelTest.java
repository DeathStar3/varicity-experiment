import neo4j_types.EntityAttribute;
import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.types.Node;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class VPLabelTest extends Neo4JTest {

    @Test
    public void setVPLabelAbstractClass() {
        runTest(graph -> {
            graph.createNode("Shape", EntityType.CLASS, EntityAttribute.ABSTRACT);
            graph.setVPLabels();
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
        });
    }

    @Test
    public void setVPLabelInterface() {
        runTest(graph -> {
            graph.createNode("Shape", EntityType.INTERFACE);
            graph.setVPLabels();
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
        });
    }


    @Test
    public void setVPLabelInterfaceWithVariants() {
        runTest(graph -> {
            graph.createNode("Shape", EntityType.INTERFACE);
            graph.setVPLabels();
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
        });
    }

    @Test
    public void setVPLabelClassVariants() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node rectangleNode = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleNode = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeNode, rectangleNode, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeNode, circleNode, RelationType.EXTENDS);
            graph.setNbVariantsProperty();
            graph.setVPLabels();
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.getString()));
            assertFalse(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.VP.getString()));
            assertFalse(graph.getNode("Circle").get().hasLabel(EntityAttribute.VP.getString()));
        });
    }

    @Test
    public void setVPLabelMethodVariants() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node drawNode1 = graph.createNode("draw", EntityType.METHOD);
            Node drawNode2 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(shapeNode, drawNode1, RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, drawNode2, RelationType.METHOD);
            graph.setMethodsOverloads();
            graph.setNbVariantsProperty();
            graph.setVPLabels();
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.getString()));
        });
    }

    @Test
    public void setVPLabelConstructorVariants() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node shapeConstructorNode1 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            Node shapeConstructorNode2 = graph.createNode("Shape", EntityType.CONSTRUCTOR);
            graph.linkTwoNodes(shapeNode, shapeConstructorNode1, RelationType.METHOD);
            graph.linkTwoNodes(shapeNode, shapeConstructorNode2, RelationType.METHOD);
            graph.setConstructorsOverloads();
            graph.setNbVariantsProperty();
            graph.setVPLabels();
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.getString()));
        });
    }

}
