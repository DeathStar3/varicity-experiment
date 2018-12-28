package configuration;

public class Experience {

    private String experienceName;
    private String sourcePackage;
    private String outputPath;

    public Experience(String experienceName, String sourcePackage, String outputPath) {
        this.experienceName = experienceName;
        this.sourcePackage = sourcePackage;
        this.outputPath = outputPath;
    }

    public String getExperienceName() {
        return experienceName;
    }

    public String getSourcePackage() {
        return sourcePackage;
    }

    public String getOutputPath() {
        return outputPath;
    }
}
