package configuration;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ParametersObject {

    public Neo4jParameters neo4j;
    public String experimentsFile;

    public Neo4jParameters getNeo4j() {
        return neo4j;
    }

}
