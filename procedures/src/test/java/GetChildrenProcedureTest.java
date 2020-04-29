import org.junit.jupiter.api.Test;
import org.neo4j.driver.*;
import org.neo4j.harness.Neo4j;
import org.neo4j.harness.internal.InProcessNeo4jBuilder;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.neo4j.driver.Values.parameters;

public class GetChildrenProcedureTest {
    private static final Config driverConfig = Config.defaultConfig();
    private Neo4j embeddedDatabaseServer = new InProcessNeo4jBuilder().withProcedure(GetChildrenProcedure.class).build();

    @Test
    public void twoMethods() {

        try (Driver driver = GraphDatabase.driver(embeddedDatabaseServer.boltURI(), driverConfig) ;
             Session session = driver.session()) {
            long nodeId = session.run("CREATE (n:CLASS {name:'Class1'}) RETURN ID(n)")
                    .single().get(0).asLong();

            session.run("MATCH (n) WHERE ID(n) = $idNode CREATE (n)-[r:METHOD]->(m:METHOD {name:'method1'})", parameters("idNode", nodeId));
            session.run("MATCH (n) WHERE ID(n) = $idNode CREATE (n)-[r:METHOD]->(m:METHOD {name:'method2'})", parameters("idNode", nodeId));

            Result result = session.run("CALL symfinder.count($idNode, $label) YIELD result as res", parameters("idNode", nodeId, "label", "METHOD"));

            List <Object> x = result.single().get("res").asList();
            assertEquals(2, x.size());
        }
    }

    @Test
    public void oneMethod() {

        try (Driver driver = GraphDatabase.driver(embeddedDatabaseServer.boltURI(), driverConfig) ;
             Session session = driver.session()) {
            long nodeId = session.run("CREATE (n:CLASS {name:'Class1'}) RETURN ID(n)")
                    .single().get(0).asLong();

            session.run("MATCH (n) WHERE ID(n) = $idNode CREATE (n)-[r:METHOD]->(m:METHOD {name:'method1'})", parameters("idNode", nodeId));
            session.run("MATCH (n) WHERE ID(n) = $idNode CREATE (n)-[r:METHOD]->(m:METHOD {name:'method1'})", parameters("idNode", nodeId));

            Result result = session.run("CALL symfinder.count($idNode, $label) YIELD result as res", parameters("idNode", nodeId, "label", "METHOD"));

            List <Object> x = result.single().get("res").asList();
            assertEquals(1, x.size());
        }
    }
}