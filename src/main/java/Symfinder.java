import org.eclipse.jdt.core.JavaCore;
import org.eclipse.jdt.core.dom.*;
import org.neo4j.driver.v1.types.Node;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Inspired by https://www.programcreek.com/2014/01/how-to-resolve-bindings-when-using-eclipse-jdt-astparser/
 */
public class Symfinder {

    private NeoGraph neoGraph;

    public Symfinder() {
        neoGraph = new NeoGraph(Configuration.getNeo4JParameter("bolt_address"),
                Configuration.getNeo4JParameter("user"),
                Configuration.getNeo4JParameter("password"));
    }

    public void run() throws IOException {
        String sourcesPackagePath = Configuration.getSourcePackage();
        String javaPackagePath = "src/main/java";
        String classpathPath = "/usr/lib/jvm/java-8-openjdk";

        List <File> files = Files.walk(Paths.get(sourcesPackagePath))
                .filter(Files::isRegularFile)
                .map(Path::toFile)
                .collect(Collectors.toList());

        for (File file : files) {
            try (Stream <String> lines = Files.lines(file.toPath(), Charset.defaultCharset())) {
                String fileContent = lines.collect(Collectors.joining("\n"));

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

                TypeFinderVisitor v = new TypeFinderVisitor();
                cu.accept(v);
            }
        }
        neoGraph.setMethodsOverloads();
        neoGraph.setConstructorsOverloads();
        neoGraph.writeGraphFile(Configuration.getGraphOutputPath());
    }

    private class TypeFinderVisitor extends ASTVisitor {

        @Override
        public boolean visit(MethodDeclaration method) {
            // Ignoring methods in anonymous classes
            if (! method.resolveBinding().getDeclaringClass().isAnonymous()) {
                String methodName = method.getName().getIdentifier();
                String parentClassName = method.resolveBinding().getDeclaringClass().getQualifiedName();
                System.out.printf("Method: %s, parent: %s\n", methodName, parentClassName);
                NeoGraph.NodeType methodType = method.isConstructor() ? NeoGraph.NodeType.CONSTRUCTOR : NeoGraph.NodeType.METHOD;
                Node methodNode = neoGraph.createNode(methodName, methodType);
                Node parentClassNode = neoGraph.getOrCreateNode(parentClassName, method.resolveBinding().getDeclaringClass().getName(), NeoGraph.NodeType.CLASS);
                neoGraph.linkTwoNodes(parentClassNode, methodNode, NeoGraph.RelationType.METHOD);
            }
            return true;
        }

        @Override
        public boolean visit(TypeDeclaration type) {
            Node thisNode;

            // If the class is an inner class
            // TODO: 11/28/18 test this
            if (! type.isPackageMemberTypeDeclaration()) {
                thisNode = neoGraph.getOrCreateNode(type.resolveBinding().getQualifiedName(), type.resolveBinding().getName(), NeoGraph.NodeType.CLASS);
                Node parentNode = neoGraph.getOrCreateNode(type.resolveBinding().getDeclaringClass().getQualifiedName(), type.resolveBinding().getDeclaringClass().getName(), NeoGraph.NodeType.CLASS);
                neoGraph.linkTwoNodes(parentNode, thisNode, NeoGraph.RelationType.INNER_CLASS);
            }

            // If the class is abstract
            if (Modifier.isAbstract(type.getModifiers())) {
                thisNode = neoGraph.getOrCreateNode(type.resolveBinding().getQualifiedName(), type.resolveBinding().getName(), NeoGraph.NodeType.CLASS, NeoGraph.NodeType.ABSTRACT);
            } else {
                thisNode = neoGraph.getOrCreateNode(type.resolveBinding().getName(), NeoGraph.NodeType.CLASS);
            }

            // Link to implemented interfaces if exist
            for (Object o : type.superInterfaceTypes()) {
                Node interfaceNode = neoGraph.getOrCreateNode(((Type) o).resolveBinding().getQualifiedName(), ((Type) o).resolveBinding().getName(), NeoGraph.NodeType.INTERFACE);
                neoGraph.linkTwoNodes(interfaceNode, thisNode, NeoGraph.RelationType.IMPLEMENTS);
            }
            // Link to superclass if exists
            // TODO: 11/28/18 filter on package (not in studied package → remove)
            ITypeBinding superclassType = type.resolveBinding().getSuperclass();
            if (superclassType != null && isExcluded(superclassType.getPackage())) {
                Node superclassNode = neoGraph.getOrCreateNode(superclassType.getQualifiedName(), superclassType.getName(), NeoGraph.NodeType.CLASS);
                neoGraph.linkTwoNodes(superclassNode, thisNode, NeoGraph.RelationType.EXTENDS);
            }
            return true;
        }

        // TODO: 11/28/18 test this
        private boolean isExcluded(IPackageBinding classPackage) {
            for (String excludedPackage : Configuration.getExcludedPackages()){
                String[] excludedPackageSplit = excludedPackage.split(".");
                String[] classPackageComponents = classPackage.getNameComponents();
                for(int i = 0 ; i < classPackageComponents.length && i < excludedPackageSplit.length ; i++){
                    if(! excludedPackageSplit[i].equals(classPackageComponents[i])){
                        return true;
                    }
                }
            }
            return false;
        }

    }
}

