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
        System.out.println(experiences);
        experiences.forEach(experience -> {
            try {
                new Symfinder(Paths.get(Configuration.getProjectsPackage()).resolve(experience.getSourcePackage()).toString(), experience.getOutputPath()).run();
                System.exit(0);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }
}
