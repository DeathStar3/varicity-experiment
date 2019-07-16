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

describe("Generating graph with one node", function () {

    beforeAll(async function () {
        await displayGraph("tests/data/graph1.json", "tests/data/graph1-stats.json", [], false);
    });
    //
    it('svg should exist', function () {
        var svg = document.getElementsByTagName('svg');
        expect(svg).not.toBe(null);
    });
    it('generated graph should contain one node', async function () {
        expect(d3.selectAll('circle').size()).toBe(1);
    });
});

describe("Generating graph with two linked nodes", function () {

    beforeAll(async function () {
        await displayGraph("tests/data/graph2.json", "tests/data/graph1-stats.json", [], false);
    });

    it('svg should exist', function () {
        var svg = document.getElementsByTagName('svg');
        expect(svg).not.toBe(null);
    });
    it('generated graph should contain two nodes', function () {
        expect($(".node").length).toBe(2);
    });
    it('generated graph should contain one link', function () {
        expect($(".link").length).toBe(1);
    });
});
