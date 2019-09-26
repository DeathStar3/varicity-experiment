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

// TODO add test case for decorator

describe("Testing JSON outputs for strategy", () => {

    var jsonData, jsonStatsData;

    beforeAll(async () => {
        const [graph, stats] = await getJsonData("tests/data/strategy.json", "tests/data/strategy-stats.json");
        jsonData = graph;
        jsonStatsData = stats;
    });

    it('Strategy is a VP', () => {
        expect(getNodeWithName(jsonData, "Strategy").types.includes("VP")).toBeTruthy();
    });
    it('Strategy is the only VP', () => {
        expect(jsonStatsData.classLevelVPs).toBe(1);
    });

});

describe("Testing JSON outputs for metrics", () => {

    var jsonData, jsonStatsData;

    beforeAll(async () => {
        const [graph, stats] = await getJsonData("tests/data/metrics.json", "tests/data/metrics-stats.json");
        jsonData = graph;
        jsonStatsData = stats;
    });

    it('there should be 5 method level VPs', () => {
        expect(jsonStatsData.methodLevelVPs).toBe(5);
    });
    it('there should be 2 constructor VPs', () => {
        expect(jsonStatsData.constructorsVPs).toBe(2);
    });
    it('there should be 3 method VPs', () => {
        expect(jsonStatsData.methodsVPs).toBe(3);
    });
    it('there should be 11 method level variants', () => {
        expect(jsonStatsData.methodLevelVariants).toBe(11);
    });
    it('there should be 5 constructor variants', () => {
        expect(jsonStatsData.constructorsVariants).toBe(5);
    });
    it('there should be 6 method variants', () => {
        expect(jsonStatsData.methodsVariants).toBe(6);
    });
    it('there should be 0 class level VP', () => {
        expect(jsonStatsData.classLevelVPs).toBe(0);
    });
    it('there should be 0 class level variants', () => {
        expect(jsonStatsData.classLevelVariants).toBe(0);
    });

});

describe("Testing JSON output for structures", () => {

    var jsonData, jsonStatsData;

    beforeAll(async () => {
        const [graph, stats] = await getJsonData("tests/data/structures.json", "tests/data/structures-stats.json");
        jsonData = graph;
        jsonStatsData = stats;
    });

    it('there should be 2 class level VPs', () => {
        expect(jsonStatsData.classLevelVPs).toBe(2);
    });
    it('there should be 1 method level VP', () => {
        expect(jsonStatsData.methodLevelVPs).toBe(1);
    });
    it('the method level VP should be a constructor VP', () => {
        expect(jsonStatsData.constructorsVPs).toBe(1);
    });
    it('there should be two constructor variants', () => {
        expect(jsonStatsData.constructorsVariants).toBe(2);
    });

});

describe("Testing JSON output for multiple_vp", () => {

    var jsonData, jsonStatsData;

    beforeAll(async () => {
        const [graph, stats] = await getJsonData("tests/data/multiple_vp.json", "tests/data/multiple_vp-stats.json");
        jsonData = graph;
        jsonStatsData = stats;
    });

    it('there should be 1 class level VP', () => {
        expect(jsonStatsData.classLevelVPs).toBe(1);
    });
    it('there should be 0 class level variant', () => {
        expect(jsonStatsData.classLevelVariants).toBe(0);
    });
    it('there should be 2 method level VPs', () => {
        expect(jsonStatsData.methodLevelVPs).toBe(2);
    });
    it('there should be 1 method VP', () => {
        expect(jsonStatsData.methodsVPs).toBe(1);
    });
    it('there should be 1 constructor VP', () => {
        expect(jsonStatsData.constructorsVPs).toBe(1);
    });
    it('there should be 2 method variants', () => {
        expect(jsonStatsData.methodsVariants).toBe(2);
    });
    it('there should be 2 constructor variants', () => {
        expect(jsonStatsData.constructorsVariants).toBe(2);
    });

});

describe("Testing JSON output for generics", () => {

    var jsonData, jsonStatsData;

    beforeAll(async () => {
        const [graph, stats] = await getJsonData("tests/data/generics.json", "tests/data/generics-stats.json");
        jsonData = graph;
        jsonStatsData = stats;
    });

    it('there should be a node called MyPair', () => {
        expect(jsonData.nodes.filter(n => n.name === "MyPair").length).toBe(1);
    });
    it('MyPair should be a strategy', () => {
        expect(getNodeWithName(jsonData, "MyPair").types.includes("STRATEGY")).toBeTruthy();
    });

});

describe("Testing JSON output for factory", () => {

    var jsonData, jsonStatsData;

    beforeAll(async () => {
        const [graph, stats] = await getJsonData("tests/data/factory.json", "tests/data/factory-stats.json");
        jsonData = graph;
        jsonStatsData = stats;
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

describe("Testing JSON output for template", () => {

    var jsonData, jsonStatsData;

    beforeAll(async () => {
        const [graph, stats] = await getJsonData("tests/data/template.json", "tests/data/template-stats.json");
        jsonData = graph;
        jsonStatsData = stats;
    });

    it('there should be 0 method level VP', () => {
        expect(jsonStatsData.methodLevelVPs).toBe(0);
    });
    it('there should be 1 class level VP', () => {
        expect(jsonStatsData.classLevelVPs).toBe(1);
    });

});

describe("Testing JSON output for decorator", () => {

    var jsonData, jsonStatsData;

    beforeAll(async () => {
        const [graph, stats] = await getJsonData("tests/data/decorator.json", "tests/data/decorator-stats.json");
        jsonData = graph;
        jsonStatsData = stats;
    });

    xit('there should be 2 class level VPs', () => {
        expect(jsonStatsData.classLevelVPs).toBe(2);
    });
    it('there should be 0 method level VP', () => {
        expect(jsonStatsData.methodLevelVPs).toBe(0);
    });
    it('there should be 2 variants', () => {
        expect(jsonStatsData.variants).toBe(2);
    });
    it('there should be 2 class level variants', () => {
        expect(jsonStatsData.classLevelVariants).toBe(2);
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