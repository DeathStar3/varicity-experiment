# symfinder

## Technical Requirements

- Docker (with Compose)
- Python 3 with PyYAML and mako libs (`pip3 install PyYAML mako`)

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

experiences_file: experiences.yaml

```

#### General parameters

- `projectsPackage`: directory where the sources for all projects will be downloaded

#### Neo4J parameters

- `boltAddress`: address where Neo4J's bolt driver is exposed
- `user`: username
- `password`: the password to access the database

#### Experiences

`experiences_file` corresponds to the path of a YAML file containing the description of the different source codes you want to analyse. Here is an example:

```yaml
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

### Building the project

Run

```bash
./symfinder.sh build
```

This script will build the integrality of the project (sources fetching, _symfinder_ core and visualization).
If you want to build only a part of the _symfinder_ toolchain, you may add one or more of the following parameters:
- `sources-fetcher`: builds a Docker image containing the scripts to clone Git repositories 
- `symfinder-core`: builds _symfinder_ and the corresponding Docker image
- `symfinder-core_skip_tests`: builds _symfinder_ without running tests and the corresponding Docker image
- `symfinder`: only rebuilds the _symfinder_ image, useful if you only applied changes to the `symfinder.yaml` file
- `visualization`: builds a Docker image starting a light web server to expose the generated visualization


### Running the project

To do this, run

```bash
./symfinder.sh run
```

This script will first execute a Python script to download the sources of the projects, then start a Docker Compose environment:
 - one container contains the Neo4j database;
 - another container contains the _symfinder_ Java application to analyse them.
During the execution, the classes and methods detected are output on the console.

If you just want to rerun the analyses, run

```bash
./symfinder.sh rerun
```

### Visualizing the generated graphs

Run

```bash
./symfinder.sh visualization
```

This will start a Docker container exposing the visualizations in a web server.
You will be able to access the visualizations at `http://localhost:8181`.