package visitors;

import neo4j_types.DesignPatternType;
import neo4j_types.EntityAttribute;
import neo4j_types.EntityType;
import neograph.NeoGraph;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jdt.core.dom.*;
import org.neo4j.driver.v1.types.Node;

import java.util.Optional;

/**
 * Detects strategy, template and decorator patterns.
 * We detect as a strategy pattern:
 * - a class who possesses at least two variants and is used as a field in another class
 * - a class whose name contains "Strategy"
 * We detect as a template pattern:
 * - an abstract class which possesses at least one subclass and contains a concrete method calling an abstract method of this same class
 * - a class whose name contains "Template"
 * We detect as a decorator pattern:
 * - an abstract class which possesses at least one subclass and contains a concrete method calling an abstract method of this same class
 * - a class whose name contains "Decorator"
 */
// TODO name contains template + update doc
public class StrategyTemplateDecoratorVisitor extends ImportsVisitor {

    private static final Logger logger = LogManager.getLogger(StrategyTemplateDecoratorVisitor.class);

    private ITypeBinding fieldDeclaringClass;

    public StrategyTemplateDecoratorVisitor(NeoGraph neoGraph) {
        super(neoGraph);
    }

    @Override
    public boolean visit(FieldDeclaration field) {
        logger.debug(field);
        ITypeBinding binding = field.getType().resolveBinding();
        if (field.getParent() instanceof TypeDeclaration && binding != null) { // prevents the case where the field is an enum, which does not bring variability
            fieldDeclaringClass = ((TypeDeclaration) field.getParent()).resolveBinding();
            Optional <String> classFullName = getClassFullName(binding);
            if (classFullName.isPresent()) {
                Optional <Node> typeNode = neoGraph.getNode(classFullName.get());
                typeNode.ifPresent(node -> {
                    if (binding.getName().contains("Strategy") || neoGraph.getNbVariants(node) >= 2) {
                        neoGraph.addLabelToNode(node, DesignPatternType.STRATEGY.toString());
                    }
                    if (isClassDecorator(binding)) {
                        Node thisClassNode = neoGraph.getNode(getClassFullName(fieldDeclaringClass).get()).get();
                        neoGraph.addLabelToNode(thisClassNode, DesignPatternType.DECORATOR.toString());
                    }
                });
            }
        }
        return false;
    }

    private boolean isClassDecorator(ITypeBinding fieldBinding) {
        String bindingQualifiedName = getClassBaseName(fieldBinding.getErasure().getQualifiedName());
        if (bindingQualifiedName.contains("Decorator")) {
            return true;
        }
        Optional <Node> fieldNode = neoGraph.getNode(getClassFullName(fieldBinding).get());
        if (fieldNode.isPresent() && ! fieldNode.get().hasLabel(EntityAttribute.OUT_OF_SCOPE.toString())) {
            if (fieldNode.get().hasLabel(EntityType.CLASS.toString())) {
                // if the field type is a class, we check if this class is inherited by the class
                ITypeBinding superclassType = fieldDeclaringClass;
                if (superclassType != null) {
                    Optional <String> superclassFullName = getClassFullName(superclassType);
                    return superclassFullName.isPresent() && superclassFullName.get().equals(bindingQualifiedName);
                }
            } else if (fieldNode.get().hasLabel(EntityType.INTERFACE.toString())) {
                // if the field type is an interface, we check if this interface is implemented by the class
                for (ITypeBinding o : fieldDeclaringClass.getInterfaces()) {
                    Optional <String> interfaceFullName = getClassFullName(o);
                    if (interfaceFullName.isPresent() && interfaceFullName.get().equals(bindingQualifiedName)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * This method is used to detect template patterns.
     * We do not explicitly check that the class is abstract as she must be abstract to define an abstract method.
     * We do not explicitly check the fact that the calling method is concrete; an abstract method cannot call another method as it does not have a body.
     */
    @Override
    public boolean visit(MethodInvocation node) {
        IMethodBinding methodBinding = node.resolveMethodBinding();
        if (methodBinding != null) { // TODO: 4/10/19 check why null in JavaGeom, math.geom3d.Box3D, p1.getX()
            ITypeBinding declaringClass = methodBinding.getDeclaringClass();
            Node declaringClassNode = neoGraph.getOrCreateNode(declaringClass.getQualifiedName(), declaringClass.isInterface() ? EntityType.INTERFACE : EntityType.CLASS, new EntityAttribute[]{EntityAttribute.OUT_OF_SCOPE}, new EntityAttribute[]{});
            if (neoGraph.getNbVariants(declaringClassNode) > 0 && (declaringClass.getName().contains("Template") || (declaringClass.equals(this.thisClassBinding) && Modifier.isAbstract(methodBinding.getModifiers())))) {
                neoGraph.addLabelToNode(declaringClassNode, DesignPatternType.TEMPLATE.toString());
            }
        }
        return false;
    }

}

