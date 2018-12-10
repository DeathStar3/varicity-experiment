package configuration;

import java.util.Map;

public class ParametersObject {

    public Neo4JParameters neo4j;
    public Map <String, Experience> experiences;

    public Neo4JParameters getNeo4j() {
        return neo4j;
    }

    public Map <String, Experience> getExperiences() {
        return experiences;
    }

}
