package neo4j_types;

public enum EntityAttribute implements NodeType {
    ABSTRACT, INNER, VP, PARAMETERIZED;

    @Override
    public String getString() {
        return this.toString();
    }

}
