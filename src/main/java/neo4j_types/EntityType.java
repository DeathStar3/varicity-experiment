package neo4j_types;

public enum EntityType implements NodeType {
    CLASS, ABSTRACT, INNER, METHOD, CONSTRUCTOR, INTERFACE, VP;

    @Override
    public String getString() {
        return this.toString();
    }
}