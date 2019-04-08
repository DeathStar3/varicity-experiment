# symfinder

## Technical Requirements

- Docker (with Compose)
- Python 3 with YAML lib (`pip3 install PyYAML`)
- Firefox for displaying output graph locally (file:/// urls)

## Setup and Running

### symfinder configuration

The application's settings are set up using a YAML file, called `symfinder.yaml`, that must be at the root of the project.
Here is an example:

```yaml
projectsPackage: resources

neo4j:
  boltAddress: bolt://localhost:7687
  user: neo4j
  password: root

experiences:
  junit:
    repositoryUrl: https://github.com/junit-team/junit4
    sourcePackage: src/main/java
    tagIds:
      - r4.12
  javaGeom:
    repositoryUrl: https://github.com/dlegland/javaGeom
    sourcePackage: src
    commitIds:
      - 7e5ee60ea9febe2acbadb75557d9659d7fafdd28
```

#### General parameters

- `projectsPackage`: directory where the sources for all projects will be downloaded

#### Neo4J parameters

- `boltAddress`: address where Neo4J's bolt driver is exposed
- `user`: username
- `password`: the password you chose

#### Experiences

`experiences` corresponds to the different source codes you want to analyse.
You can specify as many experiences as you want.
Each project is defined by different parameters:
- `repositoryUrl`: URL of the project's Git repository
- `sourcePackage`: relative path of the package containing the sources of the project to analyse. `.` corresponds to the root of the project to be analysed.
- `commitIds`: IDs of the commits to checkout
- `tagsIds`: IDs of the tags to checkout

For an experience, you can mix different commits and different tags to checkout. For example, we could have :

```yaml
junit:
  repositoryUrl: https://github.com/junit-team/junit4
  sourcePackage: src/main/java
  tagIds:
    - r4.12
    - r4.11
  commitIds:
    - c3715204786394f461d94953de9a66a4cec684e9
```

Each checkout of tag or commit ID `<id>` will be placed in a directory whose path is : `<projectsPackage>/<experienceName>-<id>`.

### Running the project

To do this, run

```bash
./run.sh
```

This script will first execute a Python script to download the sources of the projects, then build and start a Docker Compose environment:
 - one container contains the Neo4j database;
 - another container contains the symfinder Java application to analyse them.
During the execution, the classes and methods detected are output on the console.

If you just want to rerun the analyses, run

```bash
./rerun.sh
```

### Visualizing the generated graphs

Run

```bash
./visualization.sh
```

This will start a Docker container exposing the visualizations in a web server.
You will be able to access the visualizations at `http://localhost:8181`.

Currently only Firefox (and not Chrome) is correctly displaying the D3 output locally. If you have a blank screen in your Browser, you need to install a web server locally, as other browsers are prohibiting AJAX requests to file:/// urls (https://stackoverflow.com/questions/18972460/d3-bar-graph-example-not-working-locally).
