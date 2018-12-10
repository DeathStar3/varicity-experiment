package configuration;

import org.yaml.snakeyaml.Yaml;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Configuration {
    private static Configuration ourInstance = new Configuration();

    public static Configuration getInstance() {
        return ourInstance;
    }

    private static ParametersObject properties;

    private Configuration() {
        this("symfinder.yaml");
    }

    private Configuration(String propertiesFile) {
        try (FileInputStream fis = new FileInputStream(propertiesFile)) {
            Yaml yaml = new Yaml();
            properties = yaml.loadAs(fis, ParametersObject.class);
        } catch (FileNotFoundException e) {
            e.printStackTrace(); // TODO: 11/28/18 create exception
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getNeo4JBoltAddress() {
        return properties.getNeo4j().getBoltAddress();
    }

    public static String getNeo4JUser() {
        return properties.getNeo4j().getUser();
    }

    public static String getNeo4JPassword() {
        return properties.getNeo4j().getPassword();
    }

    public static List <Experience> getExperiences() {
        return new ArrayList <>(properties.getExperiences().values());
    }

}
