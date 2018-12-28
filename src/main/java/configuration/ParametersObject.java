package configuration;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ParametersObject {

    public Neo4JParameters neo4j;
    public Map <String, Project> experiences;
    public String projectsPackage;

    public Neo4JParameters getNeo4j() {
        return neo4j;
    }

    public List <Experience> getExperiences() {
        experiences.forEach((key, value) -> value.setExperienceName(key));
        return experiences.entrySet()
                .stream()
                .map(entry -> entry.getValue().getExperiences())
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    public String getProjectsPackage() {
        return projectsPackage;
    }
}
