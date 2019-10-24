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

function beforeAllVisualization(json, jsonStats) {
    return async () => {
        await display(json, jsonStats, []);
        setTimeout(() => done(), 500); // wait
    };
}

describe("Strategy pattern", () => {

    describe("Checking visualization", () => {

        beforeAll(beforeAllVisualization("tests/data/strategy.json", "tests/data/strategy-stats.json"));

        it('the graph should contain three nodes', () => {
            expect(d3.selectAll('circle').size()).toBe(3);
        });
        it('the node should have an S on it', () => {
            expect(d3.select('text[name = "Strategy"]').html()).toBe("S");
        });

    });

    describe("Checking JSON output", () => {

        var jsonData, jsonStatsData;

        beforeAll(async () => {
            const [graph, stats] = await getJsonData("tests/data/strategy.json", "tests/data/strategy-stats.json");
            jsonData = graph;
            jsonStatsData = stats;
        });

        it('Strategy is a strategy', () => {
            expect(getNodeWithName(jsonData, "Strategy").types.includes("STRATEGY")).toBeTruthy();
        });
        it('Strategy is a VP', () => {
            expect(getNodeWithName(jsonData, "Strategy").types.includes("VP")).toBeTruthy();
        });
        it('Strategy is the only VP', () => {
            expect(jsonStatsData.classLevelVPs).toBe(1);
        });

    });

});

describe("Factory pattern", () => {

    describe("Checking visualization", () => {

        beforeAll(beforeAllVisualization("tests/data/factory.json", "tests/data/factory-stats.json"));

        it('the graph should contain four nodes', () => {
            expect(d3.selectAll('circle').size()).toBe(4);
        });
        it('ShapeFactory node should have an F on it', () => {
            expect(d3.select('text[name = "ShapeFactory"]').html()).toBe("F");
        });

    });

    describe("Checking JSON output", () => {

        var jsonData, jsonStatsData;

        beforeAll(async () => {
            const [graph, stats] = await getJsonData("tests/data/factory.json", "tests/data/factory-stats.json");
            jsonData = graph;
            jsonStatsData = stats;
        });

        it('ShapeFactory should be a factory', () => {
            expect(getNodeWithName(jsonData, "ShapeFactory").types.includes("FACTORY")).toBeTruthy();
        });
        it('there should be 3 method level VPs', () => {
            expect(jsonStatsData.methodLevelVPs).toBe(3);
        });
        it('there should be 1 method VP', () => {
            expect(jsonStatsData.methodsVPs).toBe(1);
        });
        it('there should be 2 method variants', () => {
            expect(jsonStatsData.methodsVariants).toBe(2);
        });
        it('there should be 2 constructor VPs', () => {
            expect(jsonStatsData.constructorsVPs).toBe(2);
        });
        it('there should be 4 constructor variants', () => {
            expect(jsonStatsData.constructorsVariants).toBe(4);
        });

    });

});

describe("Template pattern", () => {

    describe("Checking visualization", () => {

        beforeAll(beforeAllVisualization("tests/data/template.json", "tests/data/template-stats.json"));

        xit('the graph should contain one node', () => {
            expect(d3.selectAll('circle').size()).toBe(1);
        });
        it('the node should have a T on it', () => {
            expect(d3.select('text[name = "Algorithm"]').html()).toBe("T");
        });

    });

    describe("Checking JSON output", () => {

        var jsonData, jsonStatsData;

        beforeAll(async () => {
            const [graph, stats] = await getJsonData("tests/data/template.json", "tests/data/template-stats.json");
            jsonData = graph;
            jsonStatsData = stats;
        });

        it('Algorithm should be a template', () => {
            expect(getNodeWithName(jsonData, "Algorithm").types.includes("TEMPLATE")).toBeTruthy();
        });
        it('there should be 0 method level VP', () => {
            expect(jsonStatsData.methodLevelVPs).toBe(0);
        });
        it('there should be 1 class level VP', () => {
            expect(jsonStatsData.classLevelVPs).toBe(1);
        });

    });

});

xdescribe("Decorator pattern", () => {

    describe("Checking visualization", () => {

        beforeAll(beforeAllVisualization("tests/data/decorator.json", "tests/data/decorator-stats.json"));

        it('the graph should contain two nodes: the decorator and the Troll interface', () => {
            expect(d3.selectAll('circle').size()).toBe(2);
        });
        xit('the node should be a decorator', () => {
            expect(graph.nodes.filter(n => n.name === "com.iluwatar.decorator.ClubbedTroll")[0].types.includes("DECORATOR")).toBeTruthy();
        });
        it('the node should have a D on it', () => {
            expect(d3.select('text[name = "com.iluwatar.decorator.ClubbedTroll"]').html()).toBe("D");
        });

    });

    describe("Checking JSON output", () => {

        var jsonData, jsonStatsData;

        beforeAll(async () => {
            const [graph, stats] = await getJsonData("tests/data/template.json", "tests/data/template-stats.json");
            jsonData = graph;
            jsonStatsData = stats;
        });

        it('Algorithm should be a template', () => {
            expect(getNodeWithName(jsonData, "Algorithm").types.includes("TEMPLATE")).toBeTruthy();
        });
        it('there should be 0 method level VP', () => {
            expect(jsonStatsData.methodLevelVPs).toBe(0);
        });
        it('there should be 1 class level VP', () => {
            expect(jsonStatsData.classLevelVPs).toBe(1);
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

function getNodeWithName(jsonData, name) {
    return jsonData.nodes.filter(n => n.name === name)[0];
}