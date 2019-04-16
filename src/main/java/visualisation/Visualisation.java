package visualisation;

import configuration.Configuration;
import configuration.Experience;
import j2html.tags.Tag;
import org.neo4j.io.fs.FileUtils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static j2html.TagCreator.*;

public class Visualisation {

    private static final String D3_DIRECTORY = "d3/";
    public static final String BASE_DIRECTORY = "generated_visualizations/";

    public static void setUpVisualizationFiles(){
        createBaseDirectory();
        createIndex();
        createVisualisations();
    }

    private static void createBaseDirectory(){
        try {
            Path baseDirectoryPath = Paths.get(BASE_DIRECTORY);
            Path d3DirectoryPath = Paths.get(D3_DIRECTORY);
            if(! Files.exists(baseDirectoryPath)){
                Files.createDirectory(baseDirectoryPath);
            } else {
                deleteFolder(baseDirectoryPath.toFile());
            }
            Files.copy(d3DirectoryPath.resolve("symfinder.js"), baseDirectoryPath.resolve("symfinder.js"), StandardCopyOption.REPLACE_EXISTING);
            Files.copy(d3DirectoryPath.resolve("style.css"), baseDirectoryPath.resolve("style.css"), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void createIndex() {
        try (BufferedWriter bf = new BufferedWriter(new FileWriter(BASE_DIRECTORY + "index.html"))) {
            bf.write(getIndexText());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void createVisualisations() {
        for (Experience experience : Configuration.getExperiences()) {
            String jsonFile = experience.getOutputPath().replace(BASE_DIRECTORY, "");
            String jsonStatsFile = jsonFile.replace(".json", "-stats.json");
            createVisualisation(experience,
                    String.format("%s%s.html", BASE_DIRECTORY, experience.getExperienceName()),
                    jsonFile,
                    jsonStatsFile,
                    "symfinder.js");
        }
    }

    private static void createVisualisation(Experience experience, String filePath, String jsonFile, String jsonStatsFile, String jsScriptFile) {
        try (BufferedWriter bf = new BufferedWriter(new FileWriter(filePath))) {
            String fileContent = new String(Files.readAllBytes(Paths.get(D3_DIRECTORY + "template.html")));
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

    private static void deleteFolder(File folder) {
        Arrays.stream(folder.listFiles()).forEach(file -> {
            if(file.isDirectory()) {
                deleteFolder(file);
            } else {
                file.delete();
            }
        });
    }
}
