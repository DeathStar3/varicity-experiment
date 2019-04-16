package configuration;

import visualisation.Visualisation;

import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Project {

    public String repositoryUrl;
    public String sourcePackage;
    public String[] commitIds;
    public String[] tagIds;

    private String experienceName;

    public List <Experience> getExperiences() {
        String[] ids = concat(commitIds, tagIds);
        return Arrays.stream(ids)
                .map(s -> new Experience(getExperienceName(s), getSourcePackage(s), getOutputPath(s)))
                .collect(Collectors.toList());
    }

    private String getExperienceName(String id) {
        return experienceName + "-" + id;
    }

    public String getSourcePackage(String id) {
        return Paths.get(getExperienceName(id)).resolve(sourcePackage).toString();
    }

    public String getOutputPath(String id) {
        return Visualisation.BASE_DIRECTORY + "data/" + getExperienceName(id) + ".json";
    }

    private static <T> T[] concat(T[] first, T[] second) {
        if (first == null) return second;
        if (second == null) return first;
        T[] result = Arrays.copyOf(first, first.length + second.length);
        System.arraycopy(second, 0, result, first.length, second.length);
        return result;
    }

    public void setExperienceName(String experienceName) {
        this.experienceName = experienceName;
    }
}
