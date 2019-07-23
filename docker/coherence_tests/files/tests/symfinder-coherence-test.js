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

describe("Testing coherence for JUnit", () => {

    var jsonData, jsonStatsData;

    beforeAll(async () => {
        const [graph, stats] = await getJsonData("tests/data/junit-r4.12.json", "tests/data/junit-r4.12-stats.json");
        jsonData = graph;
        jsonStatsData = stats;
    });

    it('All nodes in the visualization are VPs', () => {
        expect(jsonData.nodes.every(n => n.types.includes("VP"))).toBeTruthy();
    });

    it('There is no inner class in the visualization', () => {
        expect(jsonData.nodes.every(n => ! n.types.includes("INNER"))).toBeTruthy();
    });

});

function getJsonData(file, statsFile) {
    return new Promise(((resolve, reject) => {
        d3.queue()
            .defer(d3.json, file)
            .defer(d3.json, statsFile)
            .await(function (err, data, statsData) {
                resolve([data, statsData]);
            });
    }));
}

function getNodeWithName(jsonData, name) {
    return jsonData.nodes.filter(n => n.name === name)[0];
}