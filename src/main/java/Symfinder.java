import org.eclipse.jdt.core.JavaCore;
import org.eclipse.jdt.core.dom.*;
import org.neo4j.driver.v1.types.Node;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Inspired by https://www.programcreek.com/2014/01/how-to-resolve-bindings-when-using-eclipse-jdt-astparser/
 */
public class Symfinder {

    private static NeoGraph neoGraph = new NeoGraph("bolt://localhost:7687", "neo4j", "root");

    public static void main(String[] args) throws IOException {
        String filePath = "src/main/resources/Rectangle2D.java";
        String packagePath = "src/main/java";
        String classpathPath = "/usr/lib/jvm/java-8-openjdk";

        File file = new File(filePath);
        try (Stream <String> lines = Files.lines(file.toPath(), Charset.defaultCharset())) {
            String fileContent = lines.collect(Collectors.joining("\n"));

            ASTParser parser = ASTParser.newParser(AST.JLS8);
            parser.setResolveBindings(true);
            parser.setKind(ASTParser.K_COMPILATION_UNIT);

            parser.setBindingsRecovery(true);

            parser.setCompilerOptions(JavaCore.getOptions());

            parser.setUnitName(filePath);

            String[] sources = {packagePath};
            String[] classpath = {classpathPath};

            parser.setEnvironment(classpath, sources, new String[]{"UTF-8"}, true);
            parser.setSource(fileContent.toCharArray());

            CompilationUnit cu = (CompilationUnit) parser.createAST(null);

            if (cu.getAST().hasBindingsRecovery()) {
                System.out.println("Binding activated.");
            }

            TypeFinderVisitor v = new TypeFinderVisitor();
            cu.accept(v);
            neoGraph.setMethodsOverloads();
            neoGraph.setConstructorsOverloads();
        }
    }

}

class TypeFinderVisitor extends ASTVisitor {

    private NeoGraph neoGraph = new NeoGraph("bolt://localhost:7687", "neo4j", "root");

    @Override
    public boolean visit(MethodDeclaration method) {
        SimpleName methodName = method.getName();
        String parentClassName = method.resolveBinding().getDeclaringClass().getName();
        System.out.printf("Method: %s, parent: %s\n", methodName, parentClassName);
        Node methodNode = neoGraph.createNode(methodName.getIdentifier(), NeoGraph.NodeType.METHOD);
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