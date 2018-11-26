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

    private static NeoGraph neoGraph = new NeoGraph("bolt://localhost:7687", "neo4j", "root");

    public static void main(String[] args) throws IOException {
        String sourcesPackagePath = args[0];
        String javaPackagePath = "src/main/java";
        String classpathPath = "/usr/lib/jvm/java-8-openjdk";

        List <File> files = Files.walk(Paths.get(sourcesPackagePath))
                .filter(Files::isRegularFile)
                .map(Path::toFile)
                .collect(Collectors.toList());

        for(File file : files){
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

                Map<String, String> options = JavaCore.getOptions();
                options.put(JavaCore.COMPILER_SOURCE, JavaCore.VERSION_1_8);
                parser.setCompilerOptions(options);

                CompilationUnit cu = (CompilationUnit) parser.createAST(null);

                TypeFinderVisitor v = new TypeFinderVisitor();
                cu.accept(v);
            }
        }
        neoGraph.setMethodsOverloads();
        neoGraph.setConstructorsOverloads();
        neoGraph.writeGraphFile("d3/graph.json");
    }

}

class TypeFinderVisitor extends ASTVisitor {

    private NeoGraph neoGraph = new NeoGraph("bolt://localhost:7687", "neo4j", "root");

    @Override
    public boolean visit(MethodDeclaration method) {
        String methodName = method.getName().getIdentifier();
        String parentClassName = method.resolveBinding().getDeclaringClass().getName();
        System.out.printf("Method: %s, parent: %s\n", methodName, parentClassName);
        Node methodNode = neoGraph.createNode(methodName, NeoGraph.NodeType.METHOD);
        Node parentClassNode = neoGraph.getOrCreateNode(parentClassName, NeoGraph.NodeType.CLASS);
        neoGraph.linkTwoNodes(parentClassNode, methodNode, NeoGraph.RelationType.METHOD);
        return true;
    }

    @Override
    public boolean visit(TypeDeclaration type) {
        // If the class is an inner class
        if (!type.isPackageMemberTypeDeclaration()) {
            System.out.println("Inner class: "+ type.getName());
            Node thisNode = neoGraph.getOrCreateNode(type.getName().getIdentifier(), NeoGraph.NodeType.CLASS);
            Node parentNode = neoGraph.getOrCreateNode(type.resolveBinding().getDeclaringClass().getName(), NeoGraph.NodeType.CLASS);
            neoGraph.linkTwoNodes(parentNode, thisNode, NeoGraph.RelationType.INNER_CLASS);
        }
        return true;
    }

}