package neo4j_types;

public enum EntityAttribute implements NodeType {
    ABSTRACT, INNER, VP;

    @Override
    public String getString() {
        return this.toString();
    }

}
