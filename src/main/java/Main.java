import configuration.Configuration;
import visualisation.Visualisation;

import java.io.IOException;

public class Main {

    public static void main(String[] args) {
        Visualisation.createIndex();
        Visualisation.createVisualisations();
        Configuration.getExperiences().values().forEach(experience -> {
            try {
                new Symfinder(experience.getSourcePackage(), experience.getOutputPath()).run();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }
}
