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
        await display("tests/data/structures.json", "tests/data/structures-stats.json", []);
        setTimeout(() => done(), 500); // wait
    });


    it('the abstract class should appear', () => {
        expect(d3.select('circle[name = "AbstractClass"]').empty()).toBeFalsy();
    });

    it('the abstract class should have a dotted outline', () => {
        expect(d3.select('circle[name = "AbstractClass"]').style("stroke-dasharray")).toBe("3, 3");
    });
    xit('AbstractClass should be an abstract class', () => {
        expect(graph.nodes.filter(n => n.name === "AbstractClass")[0].types.includes("ABSTRACT")).toBeTruthy();
        expect(graph.nodes.filter(n => n.name === "AbstractClass")[0].types.includes("CLASS")).toBeTruthy();
    });

    it('the interface should appear', () => {
        expect(d3.select('circle[name = "Interface"]').empty()).toBeFalsy();
    });
    it('the interface should be black', () => {
        expect(d3.select('circle[name = "Interface"]').attr("fill")).toBe("rgb(0, 0, 0)");
    });
    xit('Interface should be an interface and not a class', () => {
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
        await display("tests/data/metrics.json", "tests/data/metrics-stats.json");
        setTimeout(() => done(), 500); // wait
    });

    xit('NoConstructorOverload should have 0 constructor VP', () => {
        expect(graph.nodes.filter(n => n.name === "NoConstructorOverload")[0].constructorVPs).toBe(0);
    });
    xit('NoConstructorOverload should have 0 constructor variant', () => {
        expect(graph.nodes.filter(n => n.name === "NoConstructorOverload")[0].constructorVariants).toBe(0);
    });
    it('OneConstructorOverload should have 1 constructor VP', () => {
        expect(graph.nodes.filter(n => n.name === "OneConstructorOverload")[0].constructorVPs).toBe(1);
    });
    it('OneConstructorOverload should have 2 constructor variants', () => {
        expect(graph.nodes.filter(n => n.name === "OneConstructorOverload")[0].constructorVariants).toBe(2);
    });
    it('TwoConstructorOverloads should have 1 overloaded constructor', () => {
        expect(graph.nodes.filter(n => n.name === "TwoConstructorOverloads")[0].constructorVPs).toBe(1);
    });
    it('TwoConstructorOverloads should have 3 constructor variants', () => {
        expect(graph.nodes.filter(n => n.name === "TwoConstructorOverloads")[0].constructorVariants).toBe(3);
    });

    xit('NoMethodOverload should have 0 method VP', () => {
        expect(graph.nodes.filter(n => n.name === "NoMethodOverload")[0].methodVPs).toBe(0);
    });
    xit('NoMethodOverload should have 0 method variant', () => {
        expect(graph.nodes.filter(n => n.name === "NoMethodOverload")[0].methodVariants).toBe(0);
    });
    xit('OneMethodOverload should have 1 method VP', () => {
        expect(graph.nodes.filter(n => n.name === "OneMethodOverload")[0].methodVPs).toBe(1);
    });
    xit('OneMethodOverload should have 2 method variants', () => {
        expect(graph.nodes.filter(n => n.name === "OneMethodOverload")[0].methodVariants).toBe(2);
    });
    xit('TwoMethodOverloads should have 2 method VPs', () => {
        expect(graph.nodes.filter(n => n.name === "TwoMethodOverloads")[0].methodVPs).toBe(2);
    });
    xit('TwoMethodOverloads should have 4 method variants', () => {
        expect(graph.nodes.filter(n => n.name === "TwoMethodOverloads")[0].methodVariants).toBe(4);
    });


});

describe("Basic inheritance", () => {

    beforeAll(async () => {
        await display("tests/data/inheritance.json", "tests/data/inheritance-stats.json", []);
        setTimeout(() => done(), 500); // wait
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

describe("Abstract decorator pattern", () => {

    beforeAll(async () => {
        await display("tests/data/abstract_decorator.json", "tests/data/abstract_decorator-stats.json", []);
        setTimeout(() => done(), 500); // wait
    });

    it('the graph should contain two nodes: the decorator and the ChristmasTree interface', () => {
        expect(d3.selectAll('circle').size()).toBe(2);
    });
    xit('the node should be a decorator', () => {
        expect(graph.nodes.filter(n => n.name === "TreeDecorator")[0].types.includes("DECORATOR")).toBeTruthy();
    });
    it('the node should have a D on it', () => {
        expect(d3.select('text[name = "TreeDecorator"]').html()).toBe("D");
    });

});

describe("Generic decorator pattern", () => {

    beforeAll(async () => {
        await display("tests/data/generic_decorator.json", "tests/data/generic_decorator-stats.json", []);
        setTimeout(() => done(), 500); // wait
    });

    it('the graph should contain two nodes: the decorator and the ChristmasTree interface', () => {
        expect(d3.selectAll('circle').size()).toBe(2);
    });
    xit('the node should be a decorator', () => {
        expect(graph.nodes.filter(n => n.name === "TreeDecorator")[0].types.includes("DECORATOR")).toBeTruthy();
    });
    it('the node should have a D on it', () => {
        expect(d3.select('text[name = "TreeDecorator"]').html()).toBe("D");
    });

});

describe("Multiple patterns", () => {

    beforeAll(async () => {
        await display("tests/data/multiple_patterns.json", "tests/data/multiple_patterns-stats.json", []);
        setTimeout(() => done(), 500); // wait
    });

    xit('Factory should be a factory and a strategy', () => {
        expect(graph.nodes.filter(n => n.name === "Factory")[0].types.includes("FACTORY")).toBeTruthy();
        expect(graph.nodes.filter(n => n.name === "Factory")[0].types.includes("STRATEGY")).toBeTruthy();
    });
    it('Factory node should have a F and a S on it', () => {
        expect(d3.select('text[name = "Factory"]').html().includes("F")).toBeTruthy();
        expect(d3.select('text[name = "Factory"]').html().includes("S")).toBeTruthy();
    });

});

