import configuration.Configuration;

import java.io.IOException;

public class Main {

    public static void main(String[] args) {
        Configuration.getExperiences().forEach(experience -> {
            try {
                new Symfinder(experience.getSourcePackage(), experience.getOutputPath()).run();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }
}
