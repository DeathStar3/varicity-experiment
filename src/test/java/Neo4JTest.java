import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.harness.junit.Neo4jRule;

import java.util.function.Consumer;

public class Neo4JTest {

    @Rule
    public Neo4jRule neo4jRule = new Neo4jRule();
    protected GraphDatabaseService graphDatabaseService;

    @Before
    public void setUp() {
        graphDatabaseService = neo4jRule.getGraphDatabaseService();
    }

    @After
    public void tearDown() {
        graphDatabaseService.shutdown();
    }

    protected void runTest(Consumer<NeoGraph> consumer){
        try (Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig())) {
            NeoGraph graph = new NeoGraph(driver);
            consumer.accept(graph);
        }
    }

}
