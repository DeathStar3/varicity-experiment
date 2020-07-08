package visitors;

import neo4j_types.EntityType;
import neo4j_types.RelationType;
import neograph.NeoGraph;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jdt.core.dom.FieldDeclaration;
import org.eclipse.jdt.core.dom.ITypeBinding;
import org.eclipse.jdt.core.dom.TypeDeclaration;
import org.neo4j.driver.types.Node;

import java.util.Optional;

public class ComposeTypeVisitor extends ImportsVisitor {

    public ComposeTypeVisitor(NeoGraph neoGraph) {
        super(neoGraph);
    }

    private static final Logger logger = LogManager.getLogger(ComposeTypeVisitor.class);

    private ITypeBinding fieldDeclaringClassBinding;

    @Override
    public boolean visit(FieldDeclaration field) {
        logger.debug(field);
        ITypeBinding fieldTypeBinding = field.getType().resolveBinding();
        if (field.getParent() instanceof TypeDeclaration && fieldTypeBinding != null) { // prevents the case where the field is an enum, which does not bring variability
            fieldDeclaringClassBinding = ((TypeDeclaration) field.getParent()).resolveBinding();
            String parentClassName = fieldDeclaringClassBinding.getName();
            Optional<String> classFullName = getClassFullName(fieldTypeBinding);
            if (classFullName.isPresent()) {
                Optional <Node> typeNode = neoGraph.getNode(classFullName.get());
                Node parentClassNode = neoGraph.getOrCreateNode(parentClassName, fieldDeclaringClassBinding.isInterface() ? EntityType.INTERFACE : EntityType.CLASS);
                typeNode.ifPresent(node -> {
                        neoGraph.linkTwoNodes(parentClassNode, node, RelationType.INSTANCIATE);
                        logger.log(Level.getLevel("MY_LEVEL"),"\n ************* Attribute "+ node.get("name") + " ----- " + parentClassNode.get("name") + " ******** \n"  );
                });
            }
        }
        return false;
    }
}
