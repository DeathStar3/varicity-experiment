import {Graph} from "./graph.js";


async function display(jsonFile, jsonStatsFile) {
    let filters = [];
    console.log("1");
    var visualization = new Graph(jsonFile, jsonStatsFile, filters);
    console.log(visualization);
    await visualization.displayGraph();
    return visualization;

}

export {display}