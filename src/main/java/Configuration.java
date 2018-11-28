import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public class Configuration {
    private static Configuration ourInstance = new Configuration();

    public static Configuration getInstance() {
        return ourInstance;
    }

    private static Properties properties;

    private Configuration(){
        this("symfinder.properties");
    }

    private Configuration(String propertiesFile) {
        try (FileInputStream fis = new FileInputStream(propertiesFile)) {
            properties = new Properties();
            properties.load(fis);
        } catch (FileNotFoundException e) {
            e.printStackTrace(); // TODO: 11/28/18 create exception
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getProperty(String str){
        return properties.getProperty(str);
    }
}
