import java.io.IOException;
import java.util.Optional;

public class Main {

    public static void main(String[] args) {
        System.setProperty("logfilename", Optional.ofNullable(System.getenv("PROJECT_NAME")).orElse("debug.log"));
        try {
            new Symfinder(args[0], args[1]).run();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.exit(0);
    }
}
