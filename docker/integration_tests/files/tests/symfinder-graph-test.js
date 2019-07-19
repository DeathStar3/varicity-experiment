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

describe("factory graph", () => {

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

describe("strategy graph", () => {

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
