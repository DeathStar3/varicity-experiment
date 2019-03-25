package neo4j_types;

public enum DesignPatternType implements NodeType {
    STRATEGY, FACTORY;

    @Override
    public String getString() {
        return this.toString();
    }
}
