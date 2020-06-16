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
    public void subtypingOneVariantThresholdTwo() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node rectangleNode = graph.createNode("Rectangle", EntityType.CLASS);
            graph.linkTwoNodes(shapeNode, rectangleNode, RelationType.EXTENDS);
            graph.detectVPsAndVariants();
            graph.detectHotspotsInSubtyping(2);
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
            assertFalse(graph.getNode("Shape").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertFalse(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void subtypingTwoVariantsThresholdTwo() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node rectangleNode = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleNode = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeNode, rectangleNode, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeNode, circleNode, RelationType.EXTENDS);
            graph.detectVPsAndVariants();
            graph.detectHotspotsInSubtyping(2);
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Circle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Circle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void subtypingTwoVariantsThresholdThree() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node rectangleNode = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleNode = graph.createNode("Circle", EntityType.CLASS);
            graph.linkTwoNodes(shapeNode, rectangleNode, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeNode, circleNode, RelationType.EXTENDS);
            graph.detectVPsAndVariants();
            graph.detectHotspotsInSubtyping(3);
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Circle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertFalse(graph.getNode("Shape").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertFalse(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertFalse(graph.getNode("Circle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void subtypingThreeVariantsThresholdThree() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            Node rectangleNode = graph.createNode("Rectangle", EntityType.CLASS);
            Node circleNode = graph.createNode("Circle", EntityType.CLASS);
            Node triangleNode = graph.createNode("Triangle", EntityType.CLASS);
            graph.linkTwoNodes(shapeNode, rectangleNode, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeNode, circleNode, RelationType.EXTENDS);
            graph.linkTwoNodes(shapeNode, triangleNode, RelationType.EXTENDS);
            graph.detectVPsAndVariants();
            graph.detectHotspotsInSubtyping(3);
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.VP.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Circle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Triangle").get().hasLabel(EntityAttribute.VARIANT.toString()));
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Rectangle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Circle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Triangle").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void methodOverloadingTwoVariantsThresholdThree() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            graph.setNodeAttribute(shapeNode, "methodVPs", 2);
            graph.detectHotspotsInMethodOverloading(3);
            assertFalse(graph.getNode("Shape").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void methodOverloadingThreeVariantsThresholdThree() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            graph.setNodeAttribute(shapeNode, "methodVPs", 3);
            graph.detectHotspotsInMethodOverloading(3);
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void constructorOverloadingTwoVariantsThresholdThree() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            graph.setNodeAttribute(shapeNode, "constructorVariants", 2);
            graph.detectHotspotsInConstructorOverloading(3);
            assertFalse(graph.getNode("Shape").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void constructorOverloadingThreeVariantsThresholdThree() {
        runTest(graph -> {
            Node shapeNode = graph.createNode("Shape", EntityType.CLASS);
            graph.setNodeAttribute(shapeNode, "constructorVariants", 3);
            graph.detectHotspotsInConstructorOverloading(3);
            assertTrue(graph.getNode("Shape").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void VPConcentrationTwoVPsThresholdTwo() {
        runTest(graph -> {
            Node vp1 = graph.createNode("Vp1", EntityType.CLASS, EntityAttribute.VP);
            Node vp2 = graph.createNode("Vp2", EntityType.CLASS, EntityAttribute.VP);
            graph.linkTwoNodes(vp1, vp2, RelationType.EXTENDS);
            graph.detectHotspotsInVPConcentration(2);
            assertTrue(graph.getNode("Vp1").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Vp2").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void VPConcentrationTwoVPsThresholdThree() {
        runTest(graph -> {
            Node vp1 = graph.createNode("Vp1", EntityType.CLASS, EntityAttribute.VP);
            Node vp2 = graph.createNode("Vp2", EntityType.CLASS, EntityAttribute.VP);
            graph.linkTwoNodes(vp1, vp2, RelationType.EXTENDS);
            graph.detectHotspotsInVPConcentration(3);
            assertFalse(graph.getNode("Vp1").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertFalse(graph.getNode("Vp2").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void VPConcentrationTwoVPsWithVariantsThresholdTwo() {
        runTest(graph -> {
            Node vp1 = graph.createNode("Vp1", EntityType.CLASS, EntityAttribute.VP);
            Node v1 = graph.createNode("V1", EntityType.CLASS, EntityAttribute.VARIANT);
            Node vp2 = graph.createNode("Vp2", EntityType.CLASS, EntityAttribute.VP);
            Node v2 = graph.createNode("V2", EntityType.CLASS, EntityAttribute.VARIANT);
            graph.linkTwoNodes(vp1, vp2, RelationType.EXTENDS);
            graph.linkTwoNodes(vp1, v1, RelationType.EXTENDS);
            graph.linkTwoNodes(vp2, v2, RelationType.EXTENDS);
            graph.detectHotspotsInVPConcentration(2);
            assertTrue(graph.getNode("Vp1").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Vp2").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("V1").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("V2").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void HotspotParentMarkedAsHotspotOneParent() {
        runTest(graph -> {
            Node vp1 = graph.createNode("Vp1", EntityType.CLASS, EntityAttribute.VP);
            Node v1 = graph.createNode("V1", EntityType.CLASS, EntityAttribute.VARIANT, EntityAttribute.HOTSPOT);
            graph.linkTwoNodes(vp1, v1, RelationType.EXTENDS);
            graph.markHotspotParentsAsHotspots();
            assertTrue(graph.getNode("Vp1").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("V1").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

    @Test
    public void HotspotParentMarkedAsHotspotTwoParents() {
        runTest(graph -> {
            Node vp1 = graph.createNode("Vp1", EntityType.INTERFACE, EntityAttribute.VP);
            Node vp2 = graph.createNode("Vp2", EntityType.INTERFACE, EntityAttribute.VP);
            Node v1 = graph.createNode("V1", EntityType.CLASS, EntityAttribute.VARIANT, EntityAttribute.HOTSPOT);
            graph.linkTwoNodes(vp1, v1, RelationType.IMPLEMENTS);
            graph.linkTwoNodes(vp2, v1, RelationType.IMPLEMENTS);
            graph.markHotspotParentsAsHotspots();
            assertTrue(graph.getNode("Vp1").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("Vp2").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
            assertTrue(graph.getNode("V1").get().hasLabel(EntityAttribute.HOTSPOT.toString()));
        });
    }

}
