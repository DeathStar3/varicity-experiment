package visitors;

import neograph.NeoGraph;
import org.eclipse.jdt.core.dom.ITypeBinding;
import org.eclipse.jdt.core.dom.ImportDeclaration;
import org.eclipse.jdt.core.dom.TypeDeclaration;
import org.neo4j.driver.v1.types.Node;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ImportsVisitor extends SymfinderVisitor {

    List <ImportDeclaration> imports = new ArrayList <>();

    protected ITypeBinding thisClassBinding = null;

    public ImportsVisitor(NeoGraph neoGraph) {
        super(neoGraph);
    }

    @Override
    public boolean visit(ImportDeclaration node) {
        if (! node.isStatic()) {
            imports.add(node);
        }
        return true;
    }

    @Override
    public boolean visit(TypeDeclaration type) {
        if (super.visit(type)) {
            this.thisClassBinding = type.resolveBinding();
            return true;
        }
        return false;
    }

    @Override
    public void endVisit(TypeDeclaration node) {
        if (visitedType) {
            thisClassBinding = null;
            imports.clear();
        }
    }


    /**
     * Iterates on imports to find the real full class name (class name with package).
     * There are two kinds of imports:
     * - imports of classes:   a.b.TheClass  (1)
     * - imports of packages:  a.b.*         (2)
     * The determination is done in three steps:
     * - If the class is in the current package, JDT directly gives us the name. If a correspondence in the database is found, return it.
     * - Iterate over (1). If a correspondence in the database is found, return it.
     * - Iterate over (2) and for each one check in the database if the package a class with this class name.
     * WARNING: all classes must have been parsed at least once before executing this method.
     * Otherwise, the class we are looking to may not exist in the database.
     *
     * @param typeBinding binding found by JDT for the type to check
     * @return String containing the real full class name
     */
    protected Optional <String> getClassFullName(ITypeBinding typeBinding) {
        String jdtFullName = typeBinding.getQualifiedName();
        if (neoGraph.getNode(jdtFullName.split("<")[0]).isPresent()) {
            return Optional.of(jdtFullName.split("<")[0]);
        }
        String className = typeBinding.getName().split("<")[0];
        Optional <ImportDeclaration> first = imports.stream()
                .filter(importDeclaration -> importDeclaration.getName().getFullyQualifiedName().endsWith(className))
                .findFirst();
        if (first.isPresent()) {
            return Optional.of(first.get().getName().getFullyQualifiedName());
        }
        Optional <Optional <Node>> first1 = imports.stream()
                .filter(ImportDeclaration::isOnDemand)
                .map(importDeclaration -> neoGraph.getNodeWithNameInPackage(className, importDeclaration.getName().getFullyQualifiedName()))
                .filter(Optional::isPresent)
                .findFirst();
        return first1.map(node -> node.get().get("name").asString()); // Optional.empty -> out of scope class
    }


}
