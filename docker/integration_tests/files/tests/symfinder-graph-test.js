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

describe("Displaying language structures", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/structures.json", "tests/data/structures-stats.json", [], false);
    });

    it('the abstract class should appear', () => {
        expect(d3.select('circle[name = "AbstractClass"]').empty()).toBeFalsy();
    });

    it('the abstract class should have a dotted outline', () => {
        expect(d3.select('circle[name = "AbstractClass"]').style("stroke-dasharray")).toBe("3, 3");
    });
    it('AbstractClass should be an abstract class', () => {
        expect(graph.nodes.filter(n => n.name === "AbstractClass")[0].types.includes("ABSTRACT")).toBeTruthy();
        expect(graph.nodes.filter(n => n.name === "AbstractClass")[0].types.includes("CLASS")).toBeTruthy();
    });

    it('the interface should appear', () => {
        expect(d3.select('circle[name = "Interface"]').empty()).toBeFalsy();
    });
    it('the interface should be black', () => {
        expect(d3.select('circle[name = "Interface"]').attr("fill")).toBe("rgb(0, 0, 0)");
    });
    it('Interface should be an interface and not a class', () => {
        expect(graph.nodes.filter(n => n.name === "Interface")[0].types.includes("INTERFACE")).toBeTruthy();
        expect(graph.nodes.filter(n => n.name === "Interface")[0].types.includes("CLASS")).toBeFalsy();
    });

    it('the normal class should not appear', () => {
        expect(d3.select('circle[name = "NormalClass"]').empty()).toBeTruthy();
    });

    it('the normal class being a VP should appear', () => {
        expect(d3.select('circle[name = "NormalClassVP"]').empty()).toBeFalsy();
    });

});

describe("Comparing metrics evolution", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/metrics.json", "tests/data/metrics-stats.json", [], false);
    });

    it('OneConstructorOverload should have one overloaded constructor', () => {
        expect(graph.nodes.filter(n => n.name === "OneConstructorOverload")[0].constructors).toBe(1);
    });
    it('TwoConstructorOverloads should have one overloaded constructor', () => {
        expect(graph.nodes.filter(n => n.name === "TwoConstructorOverloads")[0].constructors).toBe(1);
    });

    it('OneMethodOverload should have one overloaded method', () => {
        expect(graph.nodes.filter(n => n.name === "OneMethodOverload")[0].methods).toBe(1);
    });
    it('TwoMethodOverloads should have two overloaded methods', () => {
        expect(graph.nodes.filter(n => n.name === "TwoMethodOverloads")[0].methods).toBe(2);
    });


});

describe("Basic inheritance", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/inheritance.json", "tests/data/inheritance-stats.json", [], false);
    });

    it('the graph should contain Superclass as it has two variants', () => {
        expect(d3.select('circle[name = "Superclass"]').empty()).toBeFalsy();
    });
    it('the graph should contain the SubclassTwo as it is a VP', () => {
        expect(d3.select('circle[name = "SubclassTwo"]').empty()).toBeFalsy();
    });
    it('the graph should not contain the SubclassOne as it is not a VP', () => {
        expect(d3.select('circle[name = "SubclassOne"]').empty()).toBeTruthy();
    });
    it('there should be one link', () => {
        expect(d3.selectAll('line').size()).toBe(1);
    });
    it('Superclass and SubclassTwo should be linked', () => {
        expect(d3.select('line').attr("target")).toBe("SubclassTwo");
        expect(d3.select('line').attr("source")).toBe("Superclass");
    });

});

describe("Factory pattern", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/factory.json", "tests/data/factory-stats.json", [], false);
    });

    it('the graph should contain four nodes', () => {
        expect(d3.selectAll('circle').size()).toBe(4);
    });
    it('ShapeFactory should be a factory', () => {
        expect(graph.nodes.filter(n => n.name === "ShapeFactory")[0].types.includes("FACTORY")).toBeTruthy();
    });
    it('ShapeFactory node should have an F on it', () => {
        expect(d3.select('text[name = "ShapeFactory"]').html()).toBe("F");
    });

});

describe("Strategy pattern", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/strategy.json", "tests/data/strategy-stats.json", [], false);
    });

    it('the graph should contain one node', () => {
        expect(d3.selectAll('circle').size()).toBe(1);
    });
    it('the node should be a strategy', () => {
        expect(graph.nodes[0].types.includes("STRATEGY")).toBeTruthy();
    });
    it('the node should have an S on it', () => {
        expect(d3.select('text[name = "Strategy"]').html()).toBe("S");
    });

});

describe("Template pattern", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/template.json", "tests/data/template-stats.json", [], false);
    });

    it('the graph should contain one node', () => {
        expect(d3.selectAll('circle').size()).toBe(1);
    });
    it('the node should be a template', () => {
        expect(graph.nodes[0].types.includes("TEMPLATE")).toBeTruthy();
    });
    it('the node should have a T on it', () => {
        expect(d3.select('text[name = "Algorithm"]').html()).toBe("T");
    });

});

describe("Multiple patterns", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/multiple_patterns.json", "tests/data/multiple_patterns-stats.json", [], false);
    });

    it('Factory should be a factory and a strategy', () => {
        expect(graph.nodes.filter(n => n.name === "Factory")[0].types.includes("FACTORY")).toBeTruthy();
        expect(graph.nodes.filter(n => n.name === "Factory")[0].types.includes("STRATEGY")).toBeTruthy();
    });
    it('Factory node should have a F and a S on it', () => {
        expect(d3.select('text[name = "Factory"]').html().includes("F")).toBeTruthy();
        expect(d3.select('text[name = "Factory"]').html().includes("S")).toBeTruthy();
    });

});

describe("Importing a class from another package", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/import_from_different_package.json", "tests/data/import_from_different_package-stats.json", [], false);
    });

});

describe("Use of generic types", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/generics.json", "tests/data/generics-stats.json", [], false);
    });

});
