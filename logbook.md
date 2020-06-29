# logbook de stage

* Auteurs:
    * Florian Ainadou <florian.ainadou@univ-cotedazur.fr>
    * Paul-Marie DJEKINNOU <paul-marie.djekinnou@etu.univ-cotedazur.fr>
    * Djotiham Nabagou <djotiham.nabagou@etu.univ-cotedazur.fr>
    
 * Encadrants:
    * Johann Mortara <johann.mortara@univ-cotedazur.fr>
    * Philippe Collet <philippe.collet@univ-cotedazur.fr>
    * Anne-Marie Dery Pinna <anne-marie.pinna@univ-cotedazur.fr>
    
* Période de stage : **22 Juin** au **31 Juillet** 2020
* Environnement de travail : Distanciel

## Vue d'ensemble
Ceci se déroule dans le cadre du stage de 4A à Polytech Nice - Sophia Antipolis.
Le stage aborde la problématique de détection de la variabilité des API de projets open source.

### Eléments de description
Le projet sur lequel nous travaillons est intitulé Symfinder. C'est une unique base de code écrite en Java et C++ et ayant pour but l'analyse des divers codes sources (open source jusqu'ici) afin de déterminer leur variabilité.
La notion de variabilié est une est notion pas évidente à appréhender du premier coup. Les principales sources de documentation sont présentes [ici](https://deathstar3.github.io/symfinder-demo/papers/splc2019-preprint-tool.pdf).
[Rapport intermédiaire de stage](./docs_internship/SymfinderAPI_Rapport_intermediaire_stage_SI4.pdf)

### Notes
 [Notes de stage (google docs)](https://docs.google.com/document/d/1KXAPch3qqgXP3Mnon6vU7TWw2jPbenwqKQ-6ZYf9UIA/edit?usp=sharing)

## Organisation du travail
* Daily Meetings

Les daily meetings ont lieu chaque matin avec les encandrants à partir de 9h.
Il est question de discuter de l'évolution du projet à ce jour, de ce qui a été défini et fait le jour précédent.

* Organisation interne

Etant un stage en distanciel, la communication en groupe se fait via un channel privé slack. Ce sont des appels  effectués généralement après chaque daily meeting pour faire un débrief de ce qui a été dit avec les encadrants, puis tout au long de la journée en fonction de la répartition des tâches.

## Contenu du logbook

### Semaine 1
Semaine de démarrage, présentation et compréhension du sujet, définition du sprint 0, rapport intermédiaire.
* **22 Juin 2020**

        - Appel slack d'environ 2h autour de la présentation du sujet de stage
        - Début de l'analyse de Symfinder à partir de sa version publique
        - Tâches d'Organisation Github       

* **23 Juin 2020**

        - Difficultés d'exécution du code et de visualisation sous l'OS Windows (bugs docker, linux containers, mise à jour de windows)
        - Exécution sur linux

* **24 Juin 2020**

        - Daily meeting de 20 min environ
        - Difficultés d'exécution du code et de visualisation sous l'OS Windows (bugs docker, linux containers, mise à jour de windows)
        - QA sur slack
        - Analyse de JUnit 4

* **25 Juin 2020**

        - Daily meeting de 30 min environ
        - Difficultés d'exécution du code sous l'OS Windows (bugs docker, linux containers, mise à jour de windows)
        - Setup de l'intégration continue avec Travis CI
        - Problèmes de build maven dû au JDK < 11
        - Overview des tests

* **26 Juin 2020**

        - Daily meeting de 30 min environ
        - Explication et compréhension du code (call d'1h15 environ)
        - Rédaction du rapport intermédiaire
        - Création du logbook

### Semaine 2
Modification du code pour détecter et visualiser les classes et méthodes publiques de JUnit4.
* **29 Juin 2020**

        - Appel slack d'environ 20 min
        - Mise à jour du logbook
        - Détection des classes "public" de JUnit4
