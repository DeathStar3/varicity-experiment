# _symfinder_

## Technical Requirements

- Docker
    - Instruction to install Docker are available [here](https://docs.docker.com/install/#supported-platforms)
- Docker Compose
    - Instruction to install Docker Compose are available [here](https://docs.docker.com/compose/install/#install-compose)

### Reproducing the experiments

1. Build the project by running

    ```bash
    ./symfinder.sh build
    ```

2. Once the build is finished, run the analyses by running

    ```bash
    ./symfinder.sh run
    ```

This command will analyse the following projects:
- [Java AWT 8u202-b1532](https://github.com/JetBrains/jdk8u_jdk/tree/jb8u202-b1532/src/share/classes/java/awt)
- [Apache CXF 3.2.7](https://github.com/apache/cxf/tree/cxf-3.2.7/core/src/main/java/org/apache/cxf)
- [JUnit 4.12](https://github.com/junit-team/junit4/tree/r4.12/src/main/java)
- [Apache Maven 3.6.0](https://github.com/apache/maven/tree/maven-3.6.0)
- [JHipster 2.0.28](https://github.com/jhipster/jhipster/tree/2.0.28/jhipster-framework/src/main/java)
- [JFreeChart 1.5.0](https://github.com/jfree/jfreechart/tree/v1.5.0/src/main/java/org/jfree)
- [JavaGeom](https://github.com/dlegland/javaGeom/tree/7e5ee60ea9febe2acbadb75557d9659d7fafdd28/src)
- [ArgoUML](https://github.com/marcusvnac/argouml-spl/tree/bcae37308b13b7ee62da0867a77d21a0141a0f18/src)

### Analysing the output data


Once the analyses are finished, run
```bash
./symfinder.sh visualization
```
Then, in your web browser, go to `http://localhost:8181`.
An index page will appear with the list of the analysed projects.
Click on the desired project to view its visualization.

On the top left of the page is a field where you can enter the name of a class or package that you want to filter on the visualization.
When a filter is added, it is added to a list. The cross on the right allows you to remove the filter.

On the right of this field is a `Filter isolated nodes` button which, when activated, removes the nodes having no relationship from the visualization.
Click again on the button to unfilter them.

You will also find on the right of the page information about:
- the number of _vp-s_ at method level, at class level and the total number of _vp-s_ 
- the number of variants at method level, at class level and the total number of variants 