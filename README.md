# symfinder

## Building the project

```bash
mvn clean install
```

## Reproducing the experiment

### Deploy a Neo4J instance

You first need to deploy an instance of a Neo4J database.  
To do this, go to the `neo4j` directory, then launch :

```bash
docker-compose up
```

- Point your browser to http://localhost:7474/
- You will arrive on a login page. Default credentials are :
	- Username: `neo4j`
	- Password: `neo4j`
- You will be prompted a new password : enter a password of your choice

### Java application configuration

The application's settings are set up using a YAML file, called `symfinder.yaml`, that must be at the root of the project.
Here is the sample one which allows you to run the experiments on the repository.

```yaml
neo4j:
  boltAddress: bolt://localhost:7687
  user: neo4j
  password: <your_new_password>

experiences:
  paperexample:
    sourcePackage: src/main/resources/paperexample
    outputPath: d3/data/example.json
  strategy:
    sourcePackage: src/main/resources/strategy
    outputPath: d3/data/strategy.json
```

#### Neo4J parameters

- `boltAddress`: address where Neo4J's bolt driver is exposed
- `user`: username
- `password`: the password you chose

#### Experiences

`experiences` corresponds to the different source codes you want to analyze
You can specify as many experiences as you want.
Each project is defined by two parameters:
- `sourcePackage`: path of the directory containing the sources of the project to analyze
- `outputPath`: path of the generated JSON file which will be used to visualize the data

### Run the Java application

You can then start the Java application.
To do this, run

```bash
java -jar target/symfinder-1.0-SNAPSHOT.jar # mvn exec:java
```

During the execution, the classes and methods detected are output.

### Visualize the generated graphs

Open the `d3/index.html` file in your browser.
It contains a list of the analyzed projects, and redirects you to the pages containing the graphs for each project.