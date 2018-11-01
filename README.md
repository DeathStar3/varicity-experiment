# symfinder

## Building the project

```bash
mvn clean install
```

## Reproducing the experiment

You first need to launch an instance of a Neo4J database.  
To do this, go to the `neo4j` directory, then launch :

```bash
docker-compose up
```

- Point your browser to http://localhost:7474/
- You will arrive on a login page. Default credentials are :
	- Username : `neo4j`
	- Password : `neo4j`
- You will be prompted a new password : enter `root`

You can then start the Java application.
To do this, run

```bash
java -jar target/jdt-test-1.0-SNAPSHOT.jar
```

During the execution, the classes and methods detected are output.
After the execution, the number of occurences for each method is displayed.

## Visualizing the graph

Once the execution stops, the graph is generated. To display it, input the following Cypher request on the Neo4J interface :

```
MATCH (n)
RETURN (n)
```

In order to delete all nodes and relationships in the graph, run

```
MATCH (n)
DETACH DELETE n
```