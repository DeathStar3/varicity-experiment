package configuration;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ParametersObject {

    public Neo4JParameters neo4j;
    public Map <String, Project> experiences;

    public Neo4JParameters getNeo4j() {
        return neo4j;
    }

    public List <Experience> getExperiences() {
        experiences.forEach((key, value) -> value.setExperienceName(key));
        return experiences.values()
                .stream()
                .map(Project::getExperiences)
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    public String getProjectsPackage() {
        return "resources";
    }

    public String getOutputDirectory() {
        return "generated_visualizations";
    }
}
