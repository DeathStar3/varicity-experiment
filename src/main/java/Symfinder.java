import configuration.Configuration;
import org.eclipse.jdt.core.JavaCore;
import org.eclipse.jdt.core.dom.*;
import org.neo4j.driver.v1.types.Node;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Inspired by https://www.programcreek.com/2014/01/how-to-resolve-bindings-when-using-eclipse-jdt-astparser/
 */
public class Symfinder {

    private NeoGraph neoGraph;
    private String sourcePackage;
    private String graphOutputPath;

    public Symfinder(String sourcePackage, String graphOutputPath) {
        this.sourcePackage = sourcePackage;
        this.graphOutputPath = graphOutputPath;
        this.neoGraph = new NeoGraph(Configuration.getNeo4JBoltAddress(),
                Configuration.getNeo4JUser(),
                Configuration.getNeo4JPassword());
    }

    public void run() throws IOException {
        String javaPackagePath = "src/main/java";
        String classpathPath = null;

        classpathPath = System.getenv("JAVA_HOME");
        if (classpathPath == null) { // default to linux openJDK 8 path
            classpathPath = "/usr/lib/jvm/java-8-openjdk";
        }

        List <File> files = Files.walk(Paths.get(sourcePackage))
                .filter(Files::isRegularFile)
                .map(Path::toFile)
                .filter(file -> file.getName().endsWith(".java"))
                .collect(Collectors.toList());

        visitPackage(javaPackagePath, classpathPath, files, new GraphBuilderVisitor());
        visitPackage(javaPackagePath, classpathPath, files, new StrategyVisitor());
        visitPackage(javaPackagePath, classpathPath, files, new FactoryVisitor());

        neoGraph.setMethodsOverloads();
        neoGraph.setConstructorsOverloads();
        neoGraph.setNbVariantsProperty();
        neoGraph.setVPLabels();
        neoGraph.writeGraphFile(graphOutputPath);
        neoGraph.writeVPGraphFile(graphOutputPath.replace(".json", "-vp.json"));
        System.out.println("Number of methods overloads : " + neoGraph.getTotalNbMethodsOverloads());
        System.out.println("Number of constructors overloads : " + neoGraph.getTotalNbConstructorsOverloads());
        System.out.println("Number of method level overloads : " + neoGraph.getNbMethodLevelOverloads());
        System.out.println("Number of class level overloads : " + neoGraph.getNbClassLevelOverloads());
        System.out.println("Number of design patterns present : " + neoGraph.getNbNodesHavingDesignPatterns());
        neoGraph.writeStatisticsFile(graphOutputPath.replace(".json", "-stats.json"));
        System.out.println(neoGraph.generateStatisticsJson());
        neoGraph.deleteGraph();
        neoGraph.closeDriver();

    }

    private void visitPackage(String javaPackagePath, String classpathPath, List <File> files, ASTVisitor visitor) throws IOException {
        for (File file : files) {
            String fileContent = getFileLines(file);

            ASTParser parser = ASTParser.newParser(AST.JLS8);
            parser.setResolveBindings(true);
            parser.setKind(ASTParser.K_COMPILATION_UNIT);

            parser.setBindingsRecovery(true);

            parser.setCompilerOptions(JavaCore.getOptions());

            parser.setUnitName(file.getCanonicalPath());

            String[] sources = {javaPackagePath};
            String[] classpath = {classpathPath};

            parser.setEnvironment(classpath, sources, new String[]{"UTF-8"}, true);
            parser.setSource(fileContent.toCharArray());

            Map <String, String> options = JavaCore.getOptions();
            options.put(JavaCore.COMPILER_SOURCE, JavaCore.VERSION_1_8);
            parser.setCompilerOptions(options);

            CompilationUnit cu = (CompilationUnit) parser.createAST(null);
            cu.accept(visitor);
        }
    }

    private String getFileLines(File file) {
        for (Charset charset : Charset.availableCharsets().values()) {
            String lines = getFileLinesWithEncoding(file, charset);
            if (lines != null) {
                return lines;
            }
        }
        return null;
    }

    private String getFileLinesWithEncoding(File file, Charset charset) {
        try (Stream <String> lines = Files.lines(file.toPath(), charset)) {
            return lines.collect(Collectors.joining("\n"));
        } catch (UncheckedIOException e) {
            System.out.println(charset.displayName() + ": wrong encoding");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private class GraphBuilderVisitor extends ASTVisitor {

        @Override
        public boolean visit(MethodDeclaration method) {
            // Ignoring methods in anonymous classes
            if ((! (method.resolveBinding() == null)) && ! method.resolveBinding().getDeclaringClass().isAnonymous()) {
                if (! isTestClass(method.resolveBinding().getDeclaringClass())) {
                    String methodName = method.getName().getIdentifier();
                    String parentClassName = method.resolveBinding().getDeclaringClass().getQualifiedName();
                    System.out.printf("Method: %s, parent: %s\n", methodName, parentClassName);
                    NeoGraph.NodeType methodType = method.isConstructor() ? NeoGraph.EntityType.CONSTRUCTOR : NeoGraph.EntityType.METHOD;
                    Node methodNode = neoGraph.createNode(methodName, methodType);
                    Node parentClassNode = neoGraph.getOrCreateNode(parentClassName, method.resolveBinding().getDeclaringClass().getName(), NeoGraph.EntityType.CLASS);
                    neoGraph.linkTwoNodes(parentClassNode, methodNode, NeoGraph.RelationType.METHOD);
                }
            }
            return true;
        }

        @Override
        public boolean visit(TypeDeclaration type) {
            if (! isTestClass(type.resolveBinding())) {
                Node thisNode;

                // If the class is an inner class / interface
                // TODO: 11/28/18 test this
                if (! type.isPackageMemberTypeDeclaration()) {
                    thisNode = neoGraph.getOrCreateNode(type.resolveBinding().getQualifiedName(), type.resolveBinding().getName(), NeoGraph.EntityType.CLASS, NeoGraph.EntityType.INNER);
                    Node parentNode = neoGraph.getOrCreateNode(type.resolveBinding().getDeclaringClass().getQualifiedName(), type.resolveBinding().getDeclaringClass().getName(), NeoGraph.EntityType.CLASS);
                    neoGraph.linkTwoNodes(parentNode, thisNode, NeoGraph.RelationType.INNER);
                }


                // If the class is abstract
                NeoGraph.NodeType[] nodeTypes;
                if (Modifier.isAbstract(type.getModifiers())) {
                    nodeTypes = new NeoGraph.NodeType[]{NeoGraph.EntityType.CLASS, NeoGraph.EntityType.ABSTRACT};
                    // If the type is an interface
                } else if (type.isInterface()) {
                    nodeTypes = new NeoGraph.NodeType[]{NeoGraph.EntityType.INTERFACE};
                    // The type is a class
                } else {
                    nodeTypes = new NeoGraph.NodeType[]{NeoGraph.EntityType.CLASS};
                }
                thisNode = neoGraph.getOrCreateNode(type.resolveBinding().getQualifiedName(), type.resolveBinding().getName(), nodeTypes);

                // Link to implemented interfaces if exist
                for (ITypeBinding o : type.resolveBinding().getInterfaces()) {
                    Node interfaceNode = neoGraph.getOrCreateNode(o.getQualifiedName(), o.getName(), NeoGraph.EntityType.INTERFACE);
                    neoGraph.linkTwoNodes(interfaceNode, thisNode, NeoGraph.RelationType.IMPLEMENTS);
                }
                // Link to superclass if exists
                ITypeBinding superclassType = type.resolveBinding().getSuperclass();
                if (superclassType != null) {
                    Node superclassNode = neoGraph.getOrCreateNode(superclassType.getQualifiedName(), superclassType.getName(), NeoGraph.EntityType.CLASS);
                    neoGraph.linkTwoNodes(superclassNode, thisNode, NeoGraph.RelationType.EXTENDS);
                }
            }
            return true;
        }
    }

    private class StrategyVisitor extends ASTVisitor {

        @Override
        public boolean visit(FieldDeclaration field) {
            System.out.println(field);
            if (field.getType().resolveBinding() != null) { // TODO: 12/6/18 log this
                Node typeNode = neoGraph.getOrCreateNode(field.getType().resolveBinding().getQualifiedName(), NeoGraph.EntityType.CLASS);
                if (field.getType().resolveBinding().getName().contains("Strategy") || neoGraph.getNbVariants(typeNode) >= 2) {
                    neoGraph.addLabelToNode(typeNode, NeoGraph.DesignPatternType.STRATEGY.toString());
                }
            }
            return true;
        }

    }

    private class FactoryVisitor extends ASTVisitor {

        @Override
        public boolean visit(TypeDeclaration type) {
            NeoGraph.NodeType nodeType = type.isInterface() ? NeoGraph.EntityType.INTERFACE : NeoGraph.EntityType.CLASS;
            String qualifiedName = type.resolveBinding().getQualifiedName();
            if (qualifiedName.contains("Factory")) {
                neoGraph.addLabelToNode(neoGraph.getOrCreateNode(qualifiedName, nodeType), NeoGraph.DesignPatternType.FACTORY.toString());
            }
            return true;
        }

        @Override
        public boolean visit(ReturnStatement node) {
            String typeOfReturnedObject;
            if (node.getExpression() != null && node.getExpression().resolveTypeBinding() != null && (typeOfReturnedObject = node.getExpression().resolveTypeBinding().getQualifiedName()) != null) {
                System.out.println("typeOfReturnedObject : " + typeOfReturnedObject);
                MethodDeclaration methodDeclaration = (MethodDeclaration) getParentOfNodeWithType(node, ASTNode.METHOD_DECLARATION);
                if(methodDeclaration.getReturnType2().resolveBinding() != null){ // TODO: 3/22/19 find why this returns null in core/src/main/java/org/apache/cxf/bus/managers/BindingFactoryManagerImpl.java
                    String methodReturnType = methodDeclaration.getReturnType2().resolveBinding().getQualifiedName();
                    System.out.println("methodReturnType : " + methodReturnType);
                    String parsedClassType = methodDeclaration.resolveBinding().getDeclaringClass().getQualifiedName();
                    System.out.println(parsedClassType);
                    Node methodReturnTypeNode = neoGraph.getOrCreateNode(methodReturnType, NeoGraph.EntityType.CLASS);
                    Node parsedClassNode = neoGraph.getOrCreateNode(parsedClassType, NeoGraph.EntityType.CLASS);
                    if (! typeOfReturnedObject.equals(methodReturnType) && neoGraph.getNbVariants(methodReturnTypeNode) >= 2) {
                        neoGraph.addLabelToNode(parsedClassNode, NeoGraph.DesignPatternType.FACTORY.toString());
                    }
                }
            }
            return true;
        }
    }

    private boolean isTestClass(ITypeBinding classBinding) {
        return classBinding.getQualifiedName().contains("Test") ||
                Arrays.asList(classBinding.getPackage().getNameComponents()).contains("test");
    }

    private ASTNode getParentOfNodeWithType(ASTNode node, int astNodeType) {
        ASTNode parentNode = node.getParent();
        while (parentNode.getNodeType() != astNodeType) {
            parentNode = parentNode.getParent();
        }
        return parentNode;
    }
}

