package neo4j_types;

public enum RelationType implements NodeType {
    METHOD, INNER, IMPLEMENTS, EXTENDS;

    @Override
    public String getString() {
        return this.toString();
    }
}
