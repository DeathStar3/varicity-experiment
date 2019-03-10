import configuration.Configuration;
import configuration.Experience;
import visualisation.Visualisation;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

public class Main {

    public static void main(String[] args) {
        Visualisation.createIndex();
        Visualisation.createVisualisations();
        List <Experience> experiences = Configuration.getExperiences();
        experiences.forEach(experience -> {
            try {
                new Symfinder(Paths.get(Configuration.getProjectsPackage()).resolve(experience.getSourcePackage()).toString(), experience.getOutputPath()).run();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        System.exit(0);
    }
}
