/*
 * This file is part of symfinder.
 *
 * symfinder is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * symfinder is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2018-2019 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 * Copyright 2018-2019 Xhevahire Tërnava <xhevahire.ternava@lip6.fr>
 * Copyright 2018-2019 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

import neo4j_types.EntityAttribute;
import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.jupiter.api.Test;
import org.neo4j.driver.types.Node;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class HotspotTest extends Neo4jTest {

    @Test
    public void oneVariantThresholdTwo() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node rectangleNode = graph.createNode("Rectangle", EntityType.CLASS);
            graph.linkTwoNodes(shapeNode, rectangleNode, RelationType.EXTENDS);
            graph.detectVPsAndVariants();
            graph.detectHotspots(2);
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertFalse(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void twoVariantsThresholdTwo() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node rectangleNode = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleNode = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeNode, rectangleNode, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeNode, circleNode, RelationType.EXTENDS);
            graph.detectVPsAndVariants();
            graph.detectHotspots(2);
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Circle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Circle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void twoVariantsThresholdThree() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node rectangleNode = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleNode = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeNode, rectangleNode, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeNode, circleNode, RelationType.EXTENDS);
            graph.detectVPsAndVariants();
            graph.detectHotspots(3);
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Circle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertFalse(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertFalse(graph.getNode("Circle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void threeVariantsThresholdThree() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node rectangleNode = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleNode = graph.createNode("Circle", EntityType.CLASS);
            Node triangleNode = graph.createNode("Triangle", EntityType.CLASS);
            graph.linkTwoNodes(shapeNode, rectangleNode, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeNode, circleNode, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeNode, triangleNode, RelationType.EXTENDS);
            graph.detectVPsAndVariants();
            graph.detectHotspots(3);
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Circle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Triangle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Circle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Triangle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

}
