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

describe("Filtering an isolated node", () => {

    beforeAll(async (done) => {
        firstTime = true;
        await displayGraph("tests/data/graph-to-filter.json", "tests/data/stats.json", [], false);
        $("#package-to-filter").val("Shape");
        $("#add-filter-button").trigger("click");
        setTimeout(() => done(), 500); // wait for onclick event to execute totally
    });

    it('the filter is added to the list', async () => {
        expect($('#list-tab').children().length).toBe(1);
    });
    it('the node is removed from the visualization', () => {
        expect(d3.select('circle[name = "Shape"]').empty()).toBeTruthy();
    });
    xit('only the node with the exact name is filtered', () => {
        expect(d3.select('circle[name = "Shapes"]').empty()).toBeFalsy();
    });

    afterAll(() => $("#list-tab").empty())

});

describe("Unfiltering an isolated node", () => {

    beforeAll(async (done) => {
        firstTime = true;
        await displayGraph("tests/data/graph-to-filter.json", "tests/data/stats.json", ["Shape"], false);
        $(".close > span").first().trigger("click");
        setTimeout(() => done(), 500); // wait for onclick event to execute totally
    });

    it('the filter is removed from the list', () => {
        expect($('#list-tab').children().length).toBe(0);
    });
    it('the node is brought back to the visualization', () => {
        expect(d3.select('circle[name = "Shape"]').empty()).toBeFalsy();

    });
    xit('the graph is strictly identical to the one before filtering', () => {

    });

    afterAll(() => $("#list-tab").empty())

});

describe("Filtering a linked node", () => {

    beforeAll(async (done) => {
        firstTime = true;
        await displayGraph("tests/data/graph-to-filter.json", "tests/data/stats.json", [], false);
        $("#package-to-filter").val("foo.bar.Circle");
        $("#add-filter-button").trigger("click");
        setTimeout(() => done(), 500); // wait for onclick event to execute totally
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
    xit('only the node with the exact name is filtered', async () => {

    });

    afterAll(() => $("#list-tab").empty())

});
xdescribe("Unfiltering a linked node", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/graph-to-filter.json", "tests/data/stats.json", [], false);
    });

    it('the filter is removed from the list', async () => {
        expect($('#list-tab').children().length).toBe(0);
    });
    it('the node is brought back to the visualization', () => {

    });
    it('the link is brought back to the visualization', () => {

    });
    it('the graph is strictly identical to the one before filtering', () => {

    });

});

xdescribe("Filtering a package", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/graph-to-filter.json", "tests/data/stats.json", [], false);
    });

    it('the filter is added to the list', async () => {
        expect($('#list-tab').children().length).toBe(0);
    });
    it('all nodes from the package have been filtered', () => {
        var svg = document.getElementsByTagName('svg');
        expect(svg).not.toBe(null);
    });
    it('only nodes from the package have been filtered', () => {

    });

});

xdescribe("Filtering a package", () => {

    beforeAll(async () => {
        await displayGraph("tests/data/graph-to-filter.json", "tests/data/stats.json", [], false);
    });

    it('the filter is added to the list', async () => {
        expect($('#list-tab').children().length).toBe(1);
    });
    it('all nodes from the package have been filtered', () => {
        var svg = document.getElementsByTagName('svg');
        expect(svg).not.toBe(null);
    });
    it('only nodes from the package have been filtered', () => {

    });

});
