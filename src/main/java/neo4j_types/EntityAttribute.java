package neo4j_types;

public enum EntityAttribute implements NodeType {
    ABSTRACT, INNER, VP, OUT_OF_SCOPE;

    @Override
    public String getString() {
        return this.toString();
    }

}
