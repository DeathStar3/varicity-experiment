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

describe("Testing coherence of all projects", () => {

    projects = __karma__.config.projects.split(",");

    projects.forEach(project => {

        describe("Testing coherence of the JSON output for " + project, () => {

            var jsonData, jsonStatsData;

            beforeAll(async () => {
                const [graph, stats] = await getJsonData("tests/data/" + project + ".json", "tests/data/" + project + "-stats.json");
                jsonData = graph;
                jsonStatsData = stats;
            });

            it('All nodes in the visualization have different names', () => {
                var set = [...new Set(jsonData.nodes)];
                expect(set.length).toBe(jsonData.nodes.length);
            });

            it('All nodes in the visualization are VPs', () => {
                expect(jsonData.nodes.every(n => n.types.includes("VP"))).toBeTruthy();
            });

            it('There is no inner class in the visualization', () => {
                expect(jsonData.nodes.every(n => !n.types.includes("INNER"))).toBeTruthy();
            });

            it('There is no out of scope class in the visualization', () => {
                expect(jsonData.nodes.every(n => !n.types.includes("OUT_OF_SCOPE"))).toBeTruthy();
            });

            it('No interface possesses the CLASS tag', () => {
                expect(jsonData.nodes
                    .filter(n => n.types.includes("INTERFACE"))
                    .every(n => !n.types.includes("CLASS")))
                    .toBeTruthy();
            });

            it('The value of the constructorVPs attribute should be 0 or 1 for all nodes not being an interface', () => {
                expect(jsonData.nodes
                    .filter(n => !n.types.includes("INTERFACE"))
                    .map(n => n.constructorVPs)
                    .every(c => [0, 1].includes(c)))
                    .toBeTruthy();
            });

            it('All nodes in links should be in the list of nodes', () => {
                nodesNames = jsonData.nodes.map(n => n.name);
                linksSources = jsonData.links.map(l => l.source);
                linksTargets = jsonData.links.map(l => l.target);
                expect(linksSources.every(s => nodesNames.includes(s))).toBeTruthy();
                expect(linksTargets.every(t => nodesNames.includes(t))).toBeTruthy();
            });

        });

        describe("Testing coherence of the generated graph for " + project, () => {

            beforeAll(async () => {
                await displayGraph("tests/data/" + project + ".json", "tests/data/" + project + "-stats.json", [], false);
            });

            it('All abstract classes have a dotted outline', () => {
                expect(graph.nodes
                    .filter(n => n.types.includes("ABSTRACT"))
                    .map(n => d3.select('circle[name = "' + n.name + '"]'))
                    .every(c => c.style("stroke-dasharray") === "3, 3"))
                    .toBeTruthy();
            });

            it('All strategy classes have an S', () => {
                expect(graph.nodes
                    .filter(n => n.types.includes("STRATEGY"))
                    .map(n => d3.select('text[name = "' + n.name + '"]'))
                    .every(t => t.html().includes("S")))
                    .toBeTruthy();
            });

            it('All factory classes have an F', () => {
                expect(graph.nodes
                    .filter(n => n.types.includes("FACTORY"))
                    .map(n => d3.select('text[name = "' + n.name + '"]'))
                    .every(t => t.html().includes("F")))
                    .toBeTruthy();
            });

            it('All template classes have an T', () => {
                expect(graph.nodes
                    .filter(n => n.types.includes("TEMPLATE"))
                    .map(n => d3.select('text[name = "' + n.name + '"]'))
                    .every(t => t.html().includes("T")))
                    .toBeTruthy();
            });

            it('All decorator classes have a D', () => {
                expect(graph.nodes
                    .filter(n => n.types.includes("DECORATOR"))
                    .map(n => d3.select('text[name = "' + n.name + '"]'))
                    .every(t => t.html().includes("D")))
                    .toBeTruthy();
            });

            it('All interfaces have a black node', () => {
                expect(graph.nodes
                    .filter(n => n.types.includes("INTERFACE"))
                    .map(n => d3.select('circle[name = "' + n.name + '"]'))
                    .every(c => c.attr("fill") === "rgb(0, 0, 0)"))
                    .toBeTruthy();
            });

            it('Every node is visible', () => {
                expect(graph.nodes
                    .map(n => d3.select('circle[name = "' + n.name + '"]'))
                    .every(c => c.attr("r") >= 10))
                    .toBeTruthy();
            });

        });

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