import org.yaml.snakeyaml.Yaml;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class Configuration {
    private static Configuration ourInstance = new Configuration();

    public static Configuration getInstance() {
        return ourInstance;
    }

    private static Map<String, Object> properties;

    private Configuration(){
        this("symfinder.yaml");
    }

    private Configuration(String propertiesFile) {
        try (FileInputStream fis = new FileInputStream(propertiesFile)) {
            Yaml yaml = new Yaml();
            properties = yaml.load(fis);
        } catch (FileNotFoundException e) {
            e.printStackTrace(); // TODO: 11/28/18 create exception
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // TODO: 11/28/18 do this properly
    public static String getNeo4JParameter(String param){
        return ((Map <String, String>) properties.get("neo4j")).get(param);
    }

    public static String getSourcePackage(){
        return String.valueOf(properties.get("source_package"));
    }

    public static String getGraphOutputPath(){
        return String.valueOf(properties.get("output_path"));
    }

    public static List<String> getExcludedPackages(){
        return (List <String>) properties.get("excluded");
    }



}
