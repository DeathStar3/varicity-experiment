# Cypher Queries used in symfinder

This document references in th source code the Cypher queries used in _symfinder_ to detect symmetry implementations.

## Counting variation points

The total number of variation points (_vp_-s) is obtained by summing class level _vp_-s and method level _vp_-s.

### Getting the number of class level _vp_-s

Class level _vp_-s correspond to:
- interfaces
- abstract classes
- concrete extended classes

The number of interfaces is obtained by counting the number of nodes possessing the `INTERFACE` label.
The number of abstract classes is obtained by counting the number of class nodes possessing the `ABSTRACT` label.
The number of extended classes is obtained by counting the number of concrete class nodes (to avoid double counting with the abstract classes) possessing at least `EXTENDS` relationship.

https://github.com/DeathStar3/symfinder-internal/blob/454b0aba4c50bd8c0523132568d77fe229c5d671/src/main/java/NeoGraph.java#L427

### Getting the number of method level _vp_-s

Method level _vp_-s correspond to:
- overriden methods
- overriden constructors

The number of overriden methods for a class node is determined by first counting the number of different method names in the method nodes linked to this node, and storing it in the `methods` property.

https://github.com/DeathStar3/symfinder-internal/blob/454b0aba4c50bd8c0523132568d77fe229c5d671/src/main/java/NeoGraph.java#L216

Then, we get the sum of the values of this property for each node to get the total number of overriden methods.

https://github.com/DeathStar3/symfinder-internal/blob/454b0aba4c50bd8c0523132568d77fe229c5d671/src/main/java/NeoGraph.java#L389

The number of overriden constructors for a class node is determined by first counting the number of constructor nodes linked to this node, and storing it in the `constructors` property.

https://github.com/DeathStar3/symfinder-internal/blob/454b0aba4c50bd8c0523132568d77fe229c5d671/src/main/java/NeoGraph.java#L230

Then, we get the sum of the values of this property for each node to get the total number of overriden constructors.

https://github.com/DeathStar3/symfinder-internal/blob/454b0aba4c50bd8c0523132568d77fe229c5d671/src/main/java/NeoGraph.java#L379

By adding these two values, we obtain the number of method level _vp_-s.


## Counting variants

The total number of variants is obtained by summing class level variants and method level variants.

### Get the number of class level variants

The number of class level variants corresponds to the number of concrete classes without a subclass and extending a class or implementing an interface.

https://github.com/DeathStar3/symfinder-internal/blob/454b0aba4c50bd8c0523132568d77fe229c5d671/src/main/java/NeoGraph.java#L333

### Getting the number of method level variants

Method level variants correspond to:
- overrides of methods
- overrides of constructors

The number of overrides of methods is determined by counting for each class node the number of method nodes linked to it and having the same name.

https://github.com/DeathStar3/symfinder-internal/blob/454b0aba4c50bd8c0523132568d77fe229c5d671/src/main/java/NeoGraph.java#L354

The number of overrides of constructors is determined by counting for each class node the number of constructor nodes linked to it and having the same name.

https://github.com/DeathStar3/symfinder-internal/blob/454b0aba4c50bd8c0523132568d77fe229c5d671/src/main/java/NeoGraph.java#L367

By adding these two values, we obtain the number of method level variants.