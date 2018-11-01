import org.eclipse.jdt.core.JavaCore;
import org.eclipse.jdt.core.dom.*;
import org.neo4j.driver.v1.Record;
import org.neo4j.driver.v1.types.Node;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Inspired by https://www.programcreek.com/2014/01/how-to-resolve-bindings-when-using-eclipse-jdt-astparser/
 */
public class ASTTester {

    private static NeoGraph neoGraph = new NeoGraph("bolt://localhost:7687", "neo4j", "root");

    public static void main(String[] args) throws IOException {
        String filePath = "src/main/resources/Graphics2D.java";
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
            System.out.println(neoGraph.getNbOverloads());
        }
    }

}

class TypeFinderVisitor extends ASTVisitor {

    private NeoGraph neoGraph = new NeoGraph("bolt://localhost:7687", "neo4j", "root");

    private Optional<Node> classNode = Optional.empty();

    @Override
    public boolean visit(MethodDeclaration node) {
        Node methodNode = neoGraph.createNode(node.getName().getIdentifier(), NeoGraph.NodeType.METHOD);
        classNode.ifPresent(cNode -> neoGraph.linkTwoNodes(cNode, methodNode, NeoGraph.RelationType.METHOD));
        System.out.println("Method : " + node.getName());
        return true;
    }

    @Override
    public boolean visit(TypeDeclaration node) {
        classNode = Optional.of(neoGraph.createNode(node.getName().getIdentifier(), NeoGraph.NodeType.CLASS));
        System.out.println("Class : " + node.getName());
        return true;
    }

}