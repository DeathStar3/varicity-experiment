
### Description du problème
La solution serait d'augmenter la valeur de `maxTries` qui arrête d'essayer de se connecter après un certain nombre d'essais. 

### Pistes de solution
Lien vers la variable: 
https://github.com/DeathStar3-projects/symfinder-internal-api/blob/5aca58b6bd3a465ce9b825b38ad97e94e3d20114/src/main/java/neograph/NeoGraph.java#L562




### Description du problème
Le problème survient quand on essaie de stopper (avec un Ctrl+C) le container docker faisant tourner neo4j ou celui de la visualisation.
La seule solution jusqu'ici est de redémarrer complètement linux, ce qui n'est pas envisageable pour la moindre modification dans le fichier graph.js de d3

### Pistes de solution
option 1 : redémarrer le service docker (marche uniquement pour neo4j)
```sudo service docker restart```
Attention : Toutes les images docker nécessaire pour lancer neo4j peuvent disparaître.
[source](https://forums.docker.com/t/can-not-stop-docker-container-permission-denied-error/41142/2)

option 2 : Si vous ne pouvez pas lancer vos commandes Docker autrement qu'avec `sudo`, c'est qu'il faut que vous effectuiez cette étape : https://docs.docker.com/engine/install/linux-postinstall/

option 3 : Une autre solution que j'ai trouvée si le problème persiste:
`docker exec -it imageId bash` then issuing `kill 1` command.
https://github.com/docker/for-linux/issues/254#issuecomment-460070172



### Description du problème
Problème de stockage volume

### Pistes de solution
`docker system df`
`docker system prune`
`docker volume prune` (après avoir fait un docker volume ls) 
