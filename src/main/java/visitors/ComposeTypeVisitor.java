package visitors;

import neo4j_types.EntityType;
import neo4j_types.RelationType;
import neograph.NeoGraph;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jdt.core.dom.*;
import org.neo4j.driver.types.Node;

import java.util.Optional;

public class ComposeTypeVisitor extends ImportsVisitor {

    public ComposeTypeVisitor(NeoGraph neoGraph) {
        super(neoGraph);
    }

    private static final Logger logger = LogManager.getLogger(ComposeTypeVisitor.class);

    @Override
    public boolean visit(FieldDeclaration field) {
        logger.debug(field);
        ITypeBinding fieldTypeBinding = field.getType().resolveBinding();
        if (field.getParent() instanceof TypeDeclaration && fieldTypeBinding != null) { // prevents the case where the field is an enum, which does not bring variability
            ITypeBinding fieldDeclaringClassBinding = ((TypeDeclaration) field.getParent()).resolveBinding();
            String parentClassName = fieldDeclaringClassBinding.getQualifiedName();
            Optional<String> classFullName = getClassFullName(fieldTypeBinding);
            if (classFullName.isPresent()) {
                Optional <Node> typeNode = neoGraph.getNode(classFullName.get());

                Node parentClassNode = neoGraph.getOrCreateNode(parentClassName, fieldDeclaringClassBinding.isInterface() ? EntityType.INTERFACE : EntityType.CLASS);
                typeNode.ifPresent(node -> {
                    if(!(node.get("name").asString().contains("java") || node.get("name").asString().equals("double") || node.get("name").asString().equals("int")
                        || node.get("name").asString().equals("long") || node.get("name").asString().equals("float") || node.get("name").asString().equals("boolean")
                        || node.get("name").asString().contains("int[]") || node.get("name").asString().contains("double[]") || node.get("name").asString().contains("float[]")
                        || node.get("name").asString().contains("long[]") || node.get("name").asString().contains("bytes[]") || node.get("name").asString().equals("bytes") || node.get("name").asString().equals("byte"))){
                        neoGraph.linkTwoNodes(parentClassNode, node, RelationType.INSTANCIATE);
                        logger.log(Level.getLevel("MY_LEVEL"),"\n ************* Attribute "+ node.get("name") + " ----- " + parentClassNode.get("name") + " ******** \n"  );
                    }
                });
            }
        }
        return false;
    }

    @Override
    public boolean visit(MethodDeclaration method) {
        ITypeBinding declaringClass;
        if (!(method.resolveBinding() == null)) {
            declaringClass = method.resolveBinding().getDeclaringClass();
            ITypeBinding [] typeparameters = method.resolveBinding().getParameterTypes();
            String parentClassName = declaringClass.getQualifiedName();
            Node parentClassNode = neoGraph.getOrCreateNode(parentClassName, declaringClass.isInterface() ? EntityType.INTERFACE : EntityType.CLASS);
            logger.log(Level.getLevel("MY_LEVEL"),"\nJE SUIS DANS MA FONCTION\n");
            int size = typeparameters.length;
            if(size != 0){
                for (ITypeBinding typeparameter : typeparameters) {
                    logger.log(Level.getLevel("MY_LEVEL"), "\nJE SUIS DANS MA BOUCLE\n");
                    //logger.log(Level.getLevel("MY_LEVEL"), "\n******************* type parameter : " + typeparameter.getQualifiedName() + "***************\n");
                    Optional<String> classFullName = getClassFullName(typeparameter);
                    if (classFullName.isPresent()) {
                        Optional<Node> typeNode = neoGraph.getNode(classFullName.get());
                        typeNode.ifPresent(node -> {
                            if(!(node.get("name").asString().contains("java") || node.get("name").asString().equals("double") || node.get("name").asString().equals("int")
                                    || node.get("name").asString().equals("long") || node.get("name").asString().equals("float") || node.get("name").asString().equals("boolean")
                                    || node.get("name").asString().contains("int[]") || node.get("name").asString().contains("double[]") || node.get("name").asString().contains("float[]")
                                    || node.get("name").asString().contains("long[]") || node.get("name").asString().contains("bytes[]") || node.get("name").asString().equals("bytes") || node.get("name").asString().equals("byte"))){
                                neoGraph.linkTwoNodes(parentClassNode, node, RelationType.INSTANCIATE);
                                logger.log(Level.getLevel("MY_LEVEL"),"\n ************* Attribute "+ node.get("name") + " ----- " + parentClassNode.get("name") + " ******** \n"  );
                            }
                        });
                    }
                }
            }
        }
        return false;
    }

}
