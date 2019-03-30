package visualisation;

import configuration.Configuration;
import configuration.Experience;
import j2html.tags.Tag;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import static j2html.TagCreator.*;

public class Visualisation {

    public static void createIndex() {
        try(BufferedWriter bf = new BufferedWriter(new FileWriter("d3/index.html"))){ // TODO: 12/13/18 deal with directory name
            bf.write(getIndexText());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void createVisualisations(){
        for (Experience experience : Configuration.getExperiences()) {
            String jsonFile = experience.getOutputPath().replace("d3/", "");
            String jsonStatsFile = jsonFile.replace(".json", "-stats.json");
            createVisualisation(experience,
                    String.format("d3/%s.html", experience.getExperienceName()),
                    jsonFile,
                    jsonStatsFile,
                    "symfinder.js");
        }
    }

    private static void createVisualisation(Experience experience, String filePath, String jsonFile, String jsonStatsFile, String jsScriptFile) {
        try(BufferedWriter bf = new BufferedWriter(new FileWriter(filePath))){ // TODO: 12/13/18 deal with directory name
            String fileContent = new String(Files.readAllBytes(Paths.get("d3/template.html")));
            fileContent = fileContent.replace("$title", experience.getExperienceName())
                    .replace("$jsScriptFile", jsScriptFile)
                    .replace("$jsonFile", jsonFile)
                    .replace("$jsonStatsFile", jsonStatsFile);
            bf.write(fileContent);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String getIndexText() {
        return html(
                head(
                        title("Symfinder"),
                        link().withRel("stylesheet").withHref("style.css")
                ),
                body(
                        main(attrs("#main.content"),
                                h1("Symfinder")
                        ),
                        ul().with(getLinks())
                )
        ).renderFormatted();
    }

    private static List <Tag> getLinks() {
        return Configuration.getExperiences().stream()
                .map(Experience::getExperienceName)
                .map(Visualisation::graphLink)
                .collect(Collectors.toList());
    }

    private static Tag graphLink(String project) {
        return li().with(a(project).withHref(project + ".html"));
    }
}
