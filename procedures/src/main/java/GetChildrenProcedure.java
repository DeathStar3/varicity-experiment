import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Result;
import org.neo4j.graphdb.ResultTransformer;
import org.neo4j.logging.Log;
import org.neo4j.procedure.Context;
import org.neo4j.procedure.Description;
import org.neo4j.procedure.Name;
import org.neo4j.procedure.Procedure;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;


public class GetChildrenProcedure {

    // This field declares that we need a GraphDatabaseService
    // as context when any procedure in this class is invoked
    @Context
    public GraphDatabaseService db;

    // This gives us a log instance that outputs messages to the
    // standard log, normally found under `data/log/console.log`
    @Context
    public Log log;

    @Procedure(value = "symfinder.count")
    @Description("Execute lucene query in the given index, return found nodes")
    public Stream <Output> search(@Name("nodeId") long nodeId, @Name("label") String label) {
        return Stream.of(db.executeTransactionally(String.format("OPTIONAL MATCH (c)-->(m1:%s) OPTIONAL MATCH (c)-->(m2:%s) " +
                "WHERE ID(c) = %d AND m1.name = m2.name AND ID(m1) <> ID(m2) " +
                "WITH CASE WHEN m1.name IS NOT NULL THEN {name: m1.name, number: count(m1)} ELSE NULL END as counter " +
                "RETURN collect(counter)", label, label, nodeId), new HashMap <>(), Output::new));
    }

    public class Output {
        public Object result;

        public Output(Result result) {
            result.stream()
                    .findFirst().flatMap(stringObjectMap -> stringObjectMap.entrySet().stream()
                    .findFirst()).ifPresent(stringObjectEntry -> this.result = stringObjectEntry.getValue());
        }
    }
}
