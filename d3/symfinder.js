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

//	data stores
var graph, store;

//	filtered types
var filters = [];
var filterIsolated = false;
var jsonFile, jsonStatsFile;

var firstTime = true;

function getFilterItem(filter) {
    return '' +
        '<li class="list-group-item d-flex justify-content-between align-items-center" id="' + filter + '" data-toggle="list"\n' +
        '               role="tab" aria-controls="profile">'
        + filter +
        '<button type="button btn-dark" class="close" aria-label="Close">\n' +
        '  <span aria-hidden="true">&times;</span>\n' +
        '</button>' +
        '</li>';
}

async function displayGraph(jsonFile, jsonStatsFile, nodefilters = [], filterIsolated = false) {

    d3.selectAll("svg > *").remove();
    filters = nodefilters;
    this.jsonFile = jsonFile;
    this.jsonStatsFile = jsonStatsFile;
    this.filterIsolated = filterIsolated;
    if (firstTime) {
        filters.forEach(filter => {
            $("#list-tab").append(getFilterItem(filter));
        });
        firstTime = false;
    }

    await generateGraph();
}

async function generateGraph() {

    var width = window.innerWidth,
        height = window.innerHeight - 10;


    //	d3 color scales
    var color = d3.scaleLinear()
        .range(["#FFFFFF", '#FF0000'])
        .interpolate(d3.interpolateRgb);


    function generateStructure() {
        //	svg selection and sizing
        var svg = d3.select("svg").attr("width", width).attr("height", height);

        svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", -5)
            .attr("refY", 0)
            .attr("markerWidth", 4)
            .attr("markerHeight", 4)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,0L10,-5L10,5")
            .attr('fill', 'gray')
            .style('stroke', 'none');


        //add encompassing group for the zoom
        var g = svg.append("g")
            .attr("class", "everything");

        var link = g.append("g").selectAll(".link"),
            node = g.append("g").selectAll(".node"),
            label = g.append("g").selectAll(".label");
        return {svg, g, link, node, label};
    }

    var {svg, g, link, node, label} = generateStructure();

    await getData();

    async function getData() {
        return new Promise(((resolve, reject) => {
            d3.queue()
                .defer(d3.json, jsonFile)
                .defer(d3.json, jsonStatsFile)
                .await(function (err, gr, stats) {
                    if (err) throw err;
                    displayData(err, gr, stats);
                    update(node, link, label);
                    resolve();
                });
        }));

    }

    function displayData(err, gr, stats) {
        //	data read and store

        if (err) throw err;

        document.getElementById("statistics").innerHTML =
            "Number of VPs: " + stats["VPs"] + "<br>" +
            "Number of methods VPs: " + stats["methodsVPs"] + "<br>" +
            "Number of constructors VPs: " + stats["constructorsVPs"] + "<br>" +
            "Number of method level VPs: " + stats["methodLevelVPs"] + "<br>" +
            "Number of class level VPs: " + stats["classLevelVPs"] + "<br>" +
            "Number of variants: " + stats["variants"] + "<br>" +
            "Number of methods variants: " + stats["methodsVariants"] + "<br>" +
            "Number of constructors variants: " + stats["constructorsVariants"] + "<br>" +
            "Number of method level variants: " + stats["methodLevelVariants"] + "<br>" +
            "Number of class level variants: " + stats["classLevelVariants"];

        var sort = gr.nodes.filter(a => a.types.includes("CLASS")).map(a => parseInt(a.constructors)).sort((a, b) => a - b);
        color.domain([sort[0] - 3, sort[sort.length - 1]]); // TODO deal with magic number

        var nodeByID = {};

        graph = gr;
        store = $.extend(true, {}, gr);

        graph.nodes.forEach(function (n) {
            n.radius = n.types.includes("CLASS") ? 10 + n.methods : 10;
            nodeByID[n.name] = n;
        });

        graph.links.forEach(function (l) {
            l.sourceTypes = nodeByID[l.source].types;
            l.targetTypes = nodeByID[l.target].types;
        });

        store.nodes.forEach(function (n) {
            n.radius = n.types.includes("CLASS") ? 10 + n.methods : 10;
        });

        store.links.forEach(function (l) {
            l.sourceTypes = nodeByID[l.source].types;
            l.targetTypes = nodeByID[l.target].types;
        });

        graph.nodes = gr.nodes.filter(n => !filters.some(filter => matchesFilter(n.name, filter)));
        graph.links = gr.links.filter(l => !filters.some(filter => matchesFilter(l.source, filter)) && !filters.some(filter => matchesFilter(l.target, filter)));

        if (filterIsolated) {
            var nodesToKeep = new Set();
            graph.links.forEach(l => {
                nodesToKeep.add(l.source);
                nodesToKeep.add(l.target);
            });
            graph.nodes = gr.nodes.filter(n => nodesToKeep.has(n.name));
        }

    }


    //	general update pattern for updating the graph
    function update(node, link, label) {

        //	UPDATE
        node = node.data(graph.nodes, function (d) {
            return d.name;
        });
        //	EXIT
        node.exit().remove();
        //	ENTER
        var newNode = node.enter().append("circle")
            .attr("class", "node")
            .style("stroke-dasharray", function (d) {
                return d.types.includes("ABSTRACT") ? "3,3" : "3,0"
            })
            .style("stroke", "black")
            .style("stroke-width", function (d) {
                return d.nbVariants
            })
            .attr("r", function (d) {
                return d.radius
            })
            .attr("fill", function (d) {
                return d.types.includes("INTERFACE") ? d3.rgb(0, 0, 0) : d3.rgb(color(d.constructors))
            })
            .attr("name", function (d) {
                return d.name
            });

        newNode.append("title").text(function (d) {
            return "types: " + d.types + "\n" + "name: " + d.name;
        });

        //	ENTER + UPDATE
        node = node.merge(newNode);

        //	UPDATE
        link = link.data(graph.links, function (d) {
            return d.name;
        });
        //	EXIT
        link.exit().remove();
        //	ENTER
        newLink = link.enter().append("line")
            .attr("stroke-width", 1)
            .attr("class", "link")
            .attr("source", d => d.source)
            .attr("target", d => d.target)
            .attr('marker-start', "url(#arrowhead)")
            .style("pointer-events", "none");

        newLink.append("title")
            .text(function (d) {
                return "source: " + d.source + "\n" + "target: " + d.target;
            });
        //	ENTER + UPDATE
        link = link.merge(newLink);

        //  UPDATE
        label = label.data(graph.nodes, function (d) {
            return d.name;
        });
        //	EXIT
        label.exit().remove();
        //  ENTER
        var newLabel = label.enter().append("text")
            .attr("dx", -5)
            .attr("dy", ".35em")
            .attr("name", d => d.name)
            .attr("fill", function (d) {
                var nodeColor = d.types.includes("INTERFACE") ? d3.rgb(0, 0, 0) : d3.rgb(color(d.constructors));
                return contrastColor(nodeColor);
            })
            .text(function (d) {
                return ["STRATEGY", "FACTORY", "TEMPLATE"].filter(p => d.types.includes(p)).map(p => p[0]).join(", ");
            });

        //	ENTER + UPDATE
        label = label.merge(newLabel);

        d3.selectAll("circle.node").on("click", function () {
            addFilter(d3.select(this).attr("name"));
        });

        addAdvancedBehaviour(newNode, width, height, g, svg, node, link, label);
    }


}

function addAdvancedBehaviour(newNode, width, height, g, svg, node, link, label) {
    newNode.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    //	force simulation initialization
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().distance(100)
            .id(function (d) {
                return d.name;
            }))
        .force("charge", d3.forceManyBody()
            .strength(function (d) {
                return -50;
            }))
        .force("center", d3.forceCenter(width / 2, height / 2));


    //	update simulation nodes, links, and alpha
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    simulation.alpha(1).alphaTarget(0).restart();

    //add zoom capabilities
    var zoom_handler = d3.zoom()
        .on("zoom", () => g.attr("transform", d3.event.transform));

    zoom_handler(svg);

    //	drag event handlers
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    //	tick event handler with bounded box
    function ticked() {
        node
        // .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        // .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });

        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        label
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            });
    }
}

function contrastColor(color) {
    var d = 0;

    // Counting the perceptive luminance - human eye favors green color...
    const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;

    if (luminance > 0.5)
        d = 0; // bright colors - black font
    else
        d = 255; // dark colors - white font

    return d3.rgb(d, d, d);
}

/**
 * If the filter is a class filter (distinguished by the fact that it contains at least an uppercase letter),
 * we check that the class name matches the filter exactly.
 * Otherwise, the filter is a package filter, so we check that the class name starts with the filter.
 */
function matchesFilter(name, filter) {
    sp = filter.split(".");
    return /[A-Z]/.test(sp[sp.length - 1]) ? name === filter : name.startsWith(filter);
}

async function addFilter(value) {
    if (value) {
        $("#list-tab").append(getFilterItem(value));
        filters.push(value);
        await displayGraph(jsonFile, jsonStatsFile, filters, filterIsolated);
    }
}

$(document).on('click', ".list-group-item", function (e) {
    e.preventDefault();
    $('.active').removeClass('active');
});

$("#add-filter-button").on('click', async function (e) {
    e.preventDefault();
    let input = $("#package-to-filter");
    let inputValue = input.val();
    input.val("");
    await addFilter(inputValue);
});

$("#filter-isolated").on('click', async function (e) {
    e.preventDefault();
    var filtered = $(this).attr("aria-pressed") === "false";
    $(this).text(filtered ? "Unfilter isolated nodes" : "Filter isolated nodes");
    await displayGraph(jsonFile, jsonStatsFile, filters, filtered);
});

$(document).on('click', ".close", async function (e) {
    e.preventDefault();
    let removedFilter = $(e.target.parentElement.parentElement).attr("id");
    $(e.target.parentElement.parentElement).remove();
    filters.splice(filters.indexOf(removedFilter), 1);
    await displayGraph(jsonFile, jsonStatsFile, filters, filterIsolated);
});

$('#hide-info-button').click(function () {
    $(this).text(function (i, old) {
        return old === 'Show project information' ? 'Hide project information' : 'Show project information';
    });
});