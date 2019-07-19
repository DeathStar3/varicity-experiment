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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with symfinder.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2018-2019 Johann Mortara <johann.mortara@etu.univ-cotedazur.fr>
 * Copyright 2018-2019 Xhevahire Tërnava <xhevahire.ternava@lip6.fr>
 * Copyright 2018-2019 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

describe("Displaying language structures", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/structures.json", "tests/data/structures.json", [], false);
    });

    it('the abstract class should appear', () => {
        expect(d3.select('circle[name = "structures.AbstractClass"]').empty()).toBeFalsy();
    });

    it('the abstract class should have a dotted outline', () => {
        expect(d3.select('circle[name = "structures.AbstractClass"]').style("stroke-dasharray")).toBe("3, 3");
    });
    it('AbstractClass should be an abstract class', () => {
        expect(graph.nodes.filter(n => n.name === "structures.AbstractClass")[0].types.includes("ABSTRACT")).toBeTruthy();
        expect(graph.nodes.filter(n => n.name === "structures.AbstractClass")[0].types.includes("CLASS")).toBeTruthy();
    });

    it('the interface should appear', () => {
        expect(d3.select('circle[name = "structures.Interface"]').empty()).toBeFalsy();
    });
    it('the interface should be black', () => {
        expect(d3.select('circle[name = "structures.Interface"]').attr("fill")).toBe("rgb(0, 0, 0)");
    });
    it('Interface should be an interface and not a class', () => {
        expect(graph.nodes.filter(n => n.name === "structures.Interface")[0].types.includes("INTERFACE")).toBeTruthy();
        expect(graph.nodes.filter(n => n.name === "structures.Interface")[0].types.includes("CLASS")).toBeFalsy();
    });

    it('the normal class should not appear', () => {
        expect(d3.select('circle[name = "structures.NormalClass"]').empty()).toBeTruthy();
    });

    it('the normal class being a VP should appear', () => {
        expect(d3.select('circle[name = "structures.NormalClassVP"]').empty()).toBeFalsy();
    });

});

describe("Comparing metrics evolution", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/metrics.json", "tests/data/metrics.json", [], false);
    });

    it('OneConstructorOverload should have one constructor overload', () => {
        expect(graph.nodes.filter(n => n.name === "metrics.OneConstructorOverload")[0].constructors).toBe(1);
    });
    it('TwoConstructorOverloads should have two constructor overloads', () => {
        expect(graph.nodes.filter(n => n.name === "metrics.TwoConstructorOverloads")[0].constructors).toBe(2);
    });

    it('OneMethodOverload should have one method overload', () => {
        expect(graph.nodes.filter(n => n.name === "metrics.OneMethodOverload")[0].methods).toBe(1);
    });
    it('TwoMethodOverloads should have two method overloads', () => {
        expect(graph.nodes.filter(n => n.name === "metrics.TwoMethodOverloads")[0].methods).toBe(2);
    });


});

describe("Factory pattern", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/factory.json", "tests/data/factory.json", [], false);
    });

    it('the graph should contain four nodes', () => {
        expect(d3.selectAll('circle').size()).toBe(4);
    });
    it('ShapeFactory should be a factory', () => {
        expect(graph.nodes.filter(n => n.name === "factory.ShapeFactory")[0].types.includes("FACTORY")).toBeTruthy();
    });
    it('ShapeFactory node should have an F on it', () => {
        expect(d3.select('text[name = "factory.ShapeFactory"]').html()).toBe("F");
    });

});

describe("Basic inheritance", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/inheritance.json", "tests/data/inheritance.json", [], false);
    });

    it('the graph should contain Superclass as it has two variants', () => {
        expect(d3.select('circle[name = "inheritance.Superclass"]').empty()).toBeFalsy();
    });
    it('the graph should contain the SubclassTwo as it is a VP', () => {
        expect(d3.select('circle[name = "inheritance.SubclassTwo"]').empty()).toBeFalsy();
    });
    it('the graph should not contain the SubclassOne as it is not a VP', () => {
        expect(d3.select('circle[name = "inheritance.SubclassOne"]').empty()).toBeTruthy();
    });
    it('there should be one link', () => {
        expect(d3.selectAll('line').size()).toBe(1);
    });
    it('Superclass and SubclassTwo should be linked', () => {
        expect(d3.select('line').attr("target")).toBe("inheritance.SubclassTwo");
        expect(d3.select('line').attr("source")).toBe("inheritance.Superclass");
    });

});

describe("Strategy pattern", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/strategy.json", "tests/data/strategy.json", [], false);
    });

    it('the graph should contain one node', () => {
        expect(d3.selectAll('circle').size()).toBe(1);
    });
    it('the node should be a strategy', () => {
        expect(graph.nodes[0].types.includes("STRATEGY")).toBeTruthy();
    });
    it('the node should have an S on it', () => {
        expect(d3.select('text[name = "strategy.Strategy"]').html()).toBe("S");
    });

});

describe("Template pattern", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/template.json", "tests/data/template.json", [], false);
    });

    it('the graph should contain one node', () => {
        expect(d3.selectAll('circle').size()).toBe(1);
    });
    it('the node should be a template', () => {
        expect(graph.nodes[0].types.includes("TEMPLATE")).toBeTruthy();
    });
    it('the node should have a T on it', () => {
        expect(d3.select('text[name = "template.Algorithm"]').html()).toBe("T");
    });

});

describe("Importing a class from another package", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/import_from_different_package.json", "tests/data/import_from_different_package.json", [], false);
    });

});

describe("Use of generic types", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/generics.json", "tests/data/generics.json", [], false);
    });

});
