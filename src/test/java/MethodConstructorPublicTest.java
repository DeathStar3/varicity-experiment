
import neo4j_types.EntityType;
import neo4j_types.EntityVisibility;
import neo4j_types.RelationType;
import org.junit.jupiter.api.Test;
import org.neo4j.driver.types.Node;

import static org.junit.Assert.assertEquals;

public class MethodConstructorPublicTest extends Neo4jTest{

    @Test
    public void OneClassNoConstructorVariantNoMethodVariant() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS, EntityVisibility.PUBLIC);
            Node drawMethod = graph.createNode("draw", EntityType.METHOD, EntityVisibility.PUBLIC);
            graph.linkTwoNodes(rectangleClass, drawMethod, RelationType.METHOD);
            graph.setMethodPublics();

            assertEquals(1,graph.getNbPublicMethods());
        });
    }
}
