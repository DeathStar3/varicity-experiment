import configuration.Configuration;
import neo4j_types.DesignPatternType;
import neo4j_types.EntityType;
import neo4j_types.NodeType;
import neo4j_types.RelationType;
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
import java.util.*;
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

        visitPackage(javaPackagePath, classpathPath, files, new ClassesVisitor());
        visitPackage(javaPackagePath, classpathPath, files, new GraphBuilderVisitor());
        visitPackage(javaPackagePath, classpathPath, files, new StrategyVisitor());
        visitPackage(javaPackagePath, classpathPath, files, new FactoryVisitor());

        neoGraph.setMethodsOverloads();
        neoGraph.setConstructorsOverloads();
        neoGraph.setNbVariantsProperty();
        neoGraph.setVPLabels();
        neoGraph.writeVPGraphFile(graphOutputPath);
        System.out.println("Number of methods VPs: " + neoGraph.getTotalNbOverloadedMethods());
        System.out.println("Number of constructors VPs: " + neoGraph.getTotalNbOverloadedConstructors());
        System.out.println("Number of method level VPs: " + neoGraph.getNbMethodLevelVPs());
        System.out.println("Number of class level VPs: " + neoGraph.getNbClassLevelVPs());
        System.out.println("Number of methods variants: " + neoGraph.getNbMethodVariants());
        System.out.println("Number of constructors variants: " + neoGraph.getNbConstructorVariants());
        System.out.println("Number of method level variants: " + neoGraph.getNbMethodLevelVariants());
        System.out.println("Number of class level variants: " + neoGraph.getNbClassLevelVariants());
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

    /**
     * Parses all classes and the methods they contain, and adds them to the database.
     */
    private class ClassesVisitor extends ASTVisitor {

        @Override
        public boolean visit(TypeDeclaration type) {
            ITypeBinding classBinding = type.resolveBinding();
            if (! isTestClass(classBinding) && type.isPackageMemberTypeDeclaration() && ! classBinding.isEnum()) {
                NodeType nodeType;
                NodeType[] nodeTypes;
                // If the class is abstract
                if (Modifier.isAbstract(type.getModifiers())) {
                    nodeType = EntityType.CLASS;
                    nodeTypes = new NodeType[]{EntityType.ABSTRACT};
                    // If the type is an interface
                } else if (type.isInterface()) {
                    nodeType = EntityType.INTERFACE;
                    nodeTypes = new NodeType[]{};
                    // The type is a class
                } else {
                    nodeType = EntityType.CLASS;
                    nodeTypes = new NodeType[]{};
                }
                neoGraph.getOrCreateNode(classBinding.getQualifiedName(), nodeType, nodeTypes);
            }
            return true;
        }

        @Override
        public boolean visit(MethodDeclaration method) {
            // Ignoring methods in anonymous classes
            ITypeBinding declaringClass;
            if ((! (method.resolveBinding() == null)) && ! (declaringClass = method.resolveBinding().getDeclaringClass()).isAnonymous()) {
                if (! isTestClass(declaringClass)) {
                    String methodName = method.getName().getIdentifier();
                    String parentClassName = declaringClass.getQualifiedName();
                    System.out.printf("Method: %s, parent: %s\n", methodName, parentClassName);
                    NodeType methodType = method.isConstructor() ? EntityType.CONSTRUCTOR : EntityType.METHOD;
                    Node methodNode = neoGraph.createNode(methodName, methodType);
                    Node parentClassNode = neoGraph.getOrCreateNode(parentClassName, declaringClass.isInterface() ? EntityType.INTERFACE : EntityType.CLASS);
                    neoGraph.linkTwoNodes(parentClassNode, methodNode, RelationType.METHOD);
                }
            }
            return true;
        }
    }

    private class GraphBuilderVisitor extends ASTVisitor {

        List<ImportDeclaration> imports = new ArrayList <>();

        @Override
        public boolean visit(ImportDeclaration node) {
            if(! node.isStatic()){
                imports.add(node);
            }
            return true;
        }

        @Override
        public boolean visit(TypeDeclaration type) {
            ITypeBinding classBinding = type.resolveBinding();
            if (! isTestClass(classBinding) && type.isPackageMemberTypeDeclaration()) {
                String thisClassName = classBinding.getQualifiedName();
                System.out.println("Class : " + thisClassName);
                Optional <Node> thisNode = neoGraph.getNode(thisClassName);
                if(thisNode.isPresent()){
                    // Link to superclass if exists
                    ITypeBinding superclassType = classBinding.getSuperclass();
                    if (superclassType != null) {
                        createImportedClassNode(thisClassName, thisNode.get(), superclassType, EntityType.CLASS, RelationType.EXTENDS, "SUPERCLASS");
                    }

                    // Link to implemented interfaces if exist
                    for (ITypeBinding o : classBinding.getInterfaces()) {
                        createImportedClassNode(thisClassName, thisNode.get(), o, EntityType.INTERFACE, RelationType.IMPLEMENTS, "INTERFACE");
                    }
                }
            }
            return true;
        }

        // TODO: 4/1/19 functional tests : imports from different packages
        private void createImportedClassNode(String thisClassName, Node thisNode, ITypeBinding importedClassType, EntityType entityType, RelationType relationType, String name) {
            Optional <String> myImportedClass = getClassFullName(importedClassType.getName());
            String qualifiedName = importedClassType.getQualifiedName();
            if(myImportedClass.isPresent() && ! myImportedClass.get().equals(qualifiedName)){
                System.out.println(String.format("DIFFERENT %s FULL NAMES FOUND FOR CLASS %s : \n" +
                        "JDT qualified name : %s\n" +
                        "Manually resolved name : %s\n" +
                        "Getting manually resolved name.", name, thisClassName, qualifiedName, myImportedClass.get()));
            }
            Node superclassNode = neoGraph.getOrCreateNode(myImportedClass.orElse(qualifiedName), entityType);
            neoGraph.linkTwoNodes(superclassNode, thisNode, relationType);
        }

        private Optional<String> getClassFullName(String className){
            Optional <ImportDeclaration> first = imports.stream()
                    .filter(importDeclaration -> importDeclaration.getName().getFullyQualifiedName().endsWith(className))
                    .findFirst();
            if(first.isPresent()){
                return Optional.of(first.get().getName().getFullyQualifiedName());
            }
            Optional <Optional <Node>> first1 = imports.stream()
                    .filter(ImportDeclaration::isOnDemand)
                    .map(importDeclaration -> neoGraph.getNodeWithNameInPackage(className, importDeclaration.getName().getFullyQualifiedName()))
                    .filter(Optional::isPresent)
                    .findFirst();
            return first1.map(node -> node.get().get("name").asString()); // Optional.empty -> out of scope class
        }

        @Override
        public void endVisit(TypeDeclaration node) {
            imports.clear();
        }

        @Override
        public boolean visit(AnonymousClassDeclaration classDeclarationStatement) {
            return false;
        }


    }

    private class StrategyVisitor extends ASTVisitor {

        @Override
        public boolean visit(FieldDeclaration field) {
            System.out.println(field);
            ITypeBinding binding = field.getType().resolveBinding();
            if (binding != null) { // TODO: 12/6/18 log this
                Node typeNode = neoGraph.getOrCreateNode(binding.getQualifiedName(), binding.isInterface() ? EntityType.INTERFACE : EntityType.CLASS);
                if (binding.getName().contains("Strategy") || neoGraph.getNbVariants(typeNode) >= 2) {
                    neoGraph.addLabelToNode(typeNode, DesignPatternType.STRATEGY.toString());
                }
            }
            return true;
        }

        @Override
        public boolean visit(AnonymousClassDeclaration classDeclarationStatement) {
            return false;
        }

    }

    private class FactoryVisitor extends ASTVisitor {

        @Override
        public boolean visit(TypeDeclaration type) {
            String qualifiedName = type.resolveBinding().getQualifiedName();
            if (qualifiedName.contains("Factory")) {
                neoGraph.addLabelToNode(neoGraph.getOrCreateNode(qualifiedName, type.resolveBinding().isInterface() ? EntityType.INTERFACE : EntityType.CLASS), DesignPatternType.FACTORY.toString());
            }
            return true;
        }

        @Override
        public boolean visit(ReturnStatement node) {
            String typeOfReturnedObject;
            if (node.getExpression() != null &&
                    node.getExpression().resolveTypeBinding() != null &&
                    ! node.getExpression().resolveTypeBinding().isNested() &&
                    (typeOfReturnedObject = node.getExpression().resolveTypeBinding().getQualifiedName()) != null &&
                    ! typeOfReturnedObject.equals("null")) {
                MethodDeclaration methodDeclaration = (MethodDeclaration) getParentOfNodeWithType(node, ASTNode.METHOD_DECLARATION);
                if (methodDeclaration.getReturnType2().resolveBinding() != null) { // TODO: 3/22/19 find why this returns null in core/src/main/java/org/apache/cxf/bus/managers/BindingFactoryManagerImpl.java
                    String methodReturnType = methodDeclaration.getReturnType2().resolveBinding().getQualifiedName();
                    String parsedClassType = methodDeclaration.resolveBinding().getDeclaringClass().getQualifiedName();
                    System.out.println(parsedClassType);
                    System.out.println(methodDeclaration.getName().getIdentifier());
                    System.out.println("typeOfReturnedObject : " + typeOfReturnedObject);
                    System.out.println("methodReturnType : " + methodReturnType);
                    Node methodReturnTypeNode = neoGraph.getOrCreateNode(methodReturnType, methodDeclaration.getReturnType2().resolveBinding().isInterface() ? EntityType.INTERFACE : EntityType.CLASS);
                    Node parsedClassNode = neoGraph.getOrCreateNode(parsedClassType, methodDeclaration.resolveBinding().getDeclaringClass().isInterface() ? EntityType.INTERFACE : EntityType.CLASS);
                    Node returnedObjectTypeNode = neoGraph.getOrCreateNode(typeOfReturnedObject, EntityType.CLASS);
                    // TODO: 3/27/19 functional test case with method returning Object → not direct link
                    if (neoGraph.relatedTo(methodReturnTypeNode, returnedObjectTypeNode) && neoGraph.getNbVariants(methodReturnTypeNode) >= 2) {
                        neoGraph.addLabelToNode(parsedClassNode, DesignPatternType.FACTORY.toString());
                    }
                }
            }
            return true;
        }

        @Override
        public boolean visit(AnonymousClassDeclaration classDeclarationStatement) {
            return false;
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

