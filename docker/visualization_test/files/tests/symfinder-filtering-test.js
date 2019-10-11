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

import {Graph} from "graph.js"

describe("Filtering an isolated node", () => {

    beforeAll(async (done) => {
        firstTime = true;
        await displayGraph("tests/data/graph-to-filter.json", "tests/data/stats.json", [], false);
        $("#package-to-filter").val("Shape");
        $("#add-filter-button").trigger("click");
        setTimeout(() => done(), 300); // wait for onclick event to execute totally
    });

    it('the filter is added to the list', async () => {
        expect($('#list-tab').children().length).toBe(1);
    });
    it('the node is removed from the visualization', () => {
        expect(d3.select('circle[name = "Shape"]').empty()).toBeTruthy();
    });
    it('only the node with the exact name is filtered', () => {
        expect(d3.select('circle[name = "Shapes"]').empty()).toBeFalsy();
    });

    afterAll(() => $("#list-tab").empty())

});

describe("Unfiltering an isolated node", () => {

    beforeAll(async (done) => {
        firstTime = true;
        await new Graph("tests/data/graph-to-filter.json", "tests/data/stats.json", ["Shape"]).displayGraph();
        $(".close > span").first().trigger("click");
        setTimeout(() => done(), 300); // wait for onclick event to execute totally
    });

    it('the filter is removed from the list', () => {
        expect($('#list-tab').children().length).toBe(0);
    });
    it('the node is brought back to the visualization', () => {
        expect(d3.select('circle[name = "Shape"]').empty()).toBeFalsy();

    });

    afterAll(() => $("#list-tab").empty())

});

describe("Filtering a linked node", () => {

    beforeAll(async (done) => {
        firstTime = true;
        await displayGraph("tests/data/graph-to-filter.json", "tests/data/stats.json", [], false);
        $("#package-to-filter").val("foo.bar.Circle");
        $("#add-filter-button").trigger("click");
        setTimeout(() => done(), 300); // wait for onclick event to execute totally
    });

    it('the filter is added to the list', () => {
        expect($('#list-tab').children().length).toBe(1);
    });
    it('the node is removed from the visualization', () => {
        expect(d3.select('circle[name = "foo.bar.Circle"]').empty()).toBeTruthy();
    });
    it('the link is removed from the visualization', () => {
        expect(d3.select('line').size()).toBe(0);
    });

    afterAll(() => $("#list-tab").empty())

});
describe("Unfiltering a linked node", () => {

    beforeAll(async (done) => {
        firstTime = true;
        await displayGraph("tests/data/graph-to-filter.json", "tests/data/stats.json", ["foo.bar.Circle"], false);
        $(".close > span").first().trigger("click");
        setTimeout(() => done(), 300); // wait for onclick event to execute totally
    });

    it('the filter is removed from the list', async () => {
        expect($('#list-tab').children().length).toBe(0);
    });
    it('the node is brought back to the visualization', () => {
        expect(d3.select('circle[name = "foo.bar.Circle"]').empty()).toBeFalsy();
    });
    it('the link is brought back to the visualization', () => {
        expect(d3.select('line[source = "foo.bar.Circle"]').empty()).toBeFalsy();
    });

    afterAll(() => $("#list-tab").empty())

});

describe("Filtering a package", () => {

    beforeAll(async (done) => {
        firstTime = true;
        await new Graph("tests/data/graph-to-filter.json", "tests/data/stats.json", []).displayGraph();
        $("#package-to-filter").val("foo.bar");
        $("#add-filter-button").trigger("click");
        setTimeout(() => done(), 300); // wait for onclick event to execute totally
    });

    it('the filter is added to the list', async () => {
        expect($('#list-tab').children().length).toBe(1);
    });
    it('all nodes from the package have been filtered', () => {
        expect(d3.select('circle[name = "foo.bar.Circle"]').empty()).toBeTruthy();
        expect(d3.select('circle[name = "foo.bar.Square"]').empty()).toBeTruthy();
    });
    it('only nodes from the package have been filtered', () => {
        expect(d3.selectAll('circle').size()).toBe(4);
    });

    afterAll(() => $("#list-tab").empty())

});

describe("Unfiltering a package", () => {

    beforeAll(async (done) => {
        firstTime = true;
        await displayGraph("tests/data/graph-to-filter.json", "tests/data/stats.json", ["foo.bar"], false);
        $(".close > span").first().trigger("click");
        setTimeout(() => done(), 300); // wait for onclick event to execute totally
    });

    it('the filter is removed from the list', async () => {
        expect($('#list-tab').children().length).toBe(0);
    });
    it('the nodes are brought back to the visualization', () => {
        expect(d3.select('circle[name = "foo.bar.Circle"]').empty()).toBeFalsy();
        expect(d3.select('circle[name = "foo.bar.Square"]').empty()).toBeFalsy();
    });

    afterAll(() => $("#list-tab").empty())

});
