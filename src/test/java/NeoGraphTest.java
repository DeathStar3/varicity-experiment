import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.neo4j.driver.v1.Config;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.ResourceIterable;
import org.neo4j.graphdb.Transaction;
import org.neo4j.harness.junit.Neo4jRule;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class NeoGraphTest {

    @Rule
    public Neo4jRule neo4jRule = new Neo4jRule();
    private GraphDatabaseService graphDatabaseService;

    @Before
    public void setUp() throws Exception {
        graphDatabaseService = neo4jRule.getGraphDatabaseService();
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void createNode() {
        try(Driver driver = GraphDatabase.driver(neo4jRule.boltURI(), Config.build().withoutEncryption().toConfig()))
        {
            NeoGraph graph = new NeoGraph(driver);
            graph.createNode("n", NeoGraph.NodeType.CLASS);
            try(Transaction tx = graphDatabaseService.beginTx()){
                Optional <Node> optionalNode = graphDatabaseService.getAllNodes().stream().findFirst();
                assertTrue(optionalNode.isPresent());
//                assertEquals(optionalNode.get().getLabels().iterator());
                tx.success();
            }
        }
    }

    @Test
    public void linkTwoNodes() {
    }

    @Test
    public void getNbOverloads() {
    }

    @Test
    public void setMethodsOverloads() {
    }

    @Test
    public void setConstructorsOverloads() {
    }

    @Test
    public void getOrCreateNode() {
    }

    @Test
    public void writeGraphFile() {
    }

    @Test
    public void deleteGraph() {
    }
}