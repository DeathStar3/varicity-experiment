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

import {NodesFilter} from "./nodes-filter.js";
import {PackageColorer} from "./package-colorer.js";
import {VariantsFilter} from "./variants-filter.js";
import {IsolatedFilter} from "./isolated-filter.js";
import {ApiFilter} from "./api-filter.js";


class Graph {

    constructor(jsonFile, jsonStatsFile, nodeFilters, apiFilters, defaultCompositionLevel, defaultCompositionType) {
        this.jsonFile = jsonFile;
        this.jsonStatsFile = jsonStatsFile;
        this.defaultCompositionType = defaultCompositionType;
        this.defaultCompositionLevel = defaultCompositionLevel;
        this.filter = new NodesFilter("#add-filter-button", "#package-to-filter", "#list-tab", nodeFilters, async () => {
            this.firstLevelComposition = true;
            await this.displayGraph();
        });
        this.packageColorer = new PackageColorer("#add-package-button", "#package-to-color", "#color-tab", [], async () => await this.displayGraph());
        this.apiFilter = new ApiFilter("#add-api-class-button", "#api-class-to-filter", "#list-tab-api", apiFilters, async () => {
            this.firstLevelComposition = true;
            await this.displayGraph();
        });
        if (sessionStorage.getItem("firstTime") === null) {
            sessionStorage.setItem("firstTime", "true");
        }
        this.color = d3.scaleLinear();
        this.setButtonsClickActions();
        this.nodes_dict = {};
        this.links_dict = {};
        this.firstLevelComposition = true;
    }


    async displayGraph() {
        if (sessionStorage.getItem("firstTime") === "true") {
            sessionStorage.setItem("filteredIsolated", "false");
            sessionStorage.setItem("filteredVariants", "true");
            sessionStorage.setItem("firstTime", "false");
            sessionStorage.setItem("filterApi", "false");
        }
        d3.selectAll("svg > *").remove();
        this.filterIsolated = sessionStorage.getItem("filteredIsolated") === "true";
        this.filterVariants = sessionStorage.getItem("filteredVariants") === "true";
        await this.generateGraph();
        return this.graph;
    }

    async generateGraph() {

        this.width = window.innerWidth;
        this.height = window.innerHeight - 10;

        this.generateStructure(this.width, this.height);

        await this.getData(this);

    }

    generateStructure(width, height) {
        //	svg selection and sizing
        this.svg = d3.select("svg").attr("width", width).attr("height", height);

        this.svg.append('defs').append('marker')
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
        this.g = this.svg.append("g")
            .attr("class", "everything");

        this.link = this.g.append("g").selectAll(".link");
        this.node = this.g.append("g").selectAll(".node");
        this.label = this.g.append("g").selectAll(".label");
    }

    async getData(graph) {
        return new Promise((resolve, reject) => {
            d3.queue()
                .defer(d3.json, graph.jsonFile)
                .defer(d3.json, graph.jsonStatsFile)
                .await((err, gr, stats) => {
                    if (err) throw err;
                    graph.displayData(gr, stats);
                    graph.update();
                    resolve();
                });
        });

    }

    displayData(gr, stats) {

        const compositionTypeEnum = {
            IN: 'IN',
            OUT: 'OUT',
            IN_OUT: 'IN-OUT'
        }

        //	data read and store
        document.getElementById("statistics").innerHTML =
            // "Number of VPs: " + stats["VPs"] + "<br>" +
            // "Number of methods VPs: " + stats["methodVPs"] + "<br>" +
            // "Number of constructors VPs: " + stats["constructorsVPs"] + "<br>" +
            "Number of class level VPs: " + stats["classLevelVPs"] + "<br>" +
            "Number of method level VPs: " + stats["methodLevelVPs"] + "<br>" +
            // "Number of variants: " + stats["variants"] + "<br>" +
            // "Number of methods variants: " + stats["methodsVariants"] + "<br>" +
            // "Number of constructors variants: " + stats["constructorsVariants"] + "<br>" +
            "Number of class level variants: " + stats["classLevelVariants"] + "<br>" +
            "Number of method level variants: " + stats["methodLevelVariants"];

        var sort = gr.allnodes.filter(a => a.types.includes("CLASS")).map(a => parseInt(a.constructorVariants)).sort((a, b) => a - b);
        this.color.domain([sort[0] - 3, sort[sort.length - 1]]); // TODO deal with magic number

        var nodeByID = {};

        this.graph = gr;
        this.store = $.extend(true, {}, gr);

        this.graph.allnodes.forEach(function (n) {
            n.radius = n.types.includes("CLASS") ? 10 + n.methodVPs : 10;
            nodeByID[n.name] = n;
        });

        this.graph.alllinks.forEach(function (l) {
            l.sourceTypes = nodeByID[l.source].types;
            l.targetTypes = nodeByID[l.target].types;
        });

        this.store.allnodes.forEach(function (n) {
            n.radius = n.types.includes("CLASS") ? 10 + n.methodVPs : 10;
        });

        this.store.alllinks.forEach(function (l) {
            l.sourceTypes = nodeByID[l.source].types;
            l.targetTypes = nodeByID[l.target].types;
        });


        this.graph.allnodes = this.filter.getNodesListWithoutMatchingFilter(gr.allnodes);
        this.graph.alllinks = this.filter.getLinksListWithoutMatchingFilter(gr.alllinks);

        this.nodesList = [];
        this.apiList = [];

        if (this.filterVariants) {
            var variantsFilter = new VariantsFilter(this.graph.allnodes, this.graph.alllinks);
            this.graph.allnodes = variantsFilter.getFilteredNodesList();
            this.graph.alllinks = variantsFilter.getFilteredLinksList();
        }

        if (this.filterIsolated) {
            var isolatedFilter = new IsolatedFilter(this.graph.allnodes, this.graph.alllinks);
            this.graph.allnodes = isolatedFilter.getFilteredNodesList();
        }

        if (this.firstLevelComposition) {
            $("#composition-type").val(this.defaultCompositionType);
        }


        if (this.apiFilter.filtersList.length !== 0) {
            if (document.getElementById("compositionLevel").style.display === "none") document.getElementById("compositionLevel").style.display = "block";
            //Filter to found all nodes which are in the api list
            this.nodesList = this.apiFilter.getNodesListWithMatchingFilter(gr.allnodes);
            this.apiList = this.apiFilter.getNodesListWithMatchingFilter(gr.allnodes);
            //Found all the links which contains one of the api class as target or sources
            var current = [];
            if (this.apiList.length !== 0) {
                this.apiList.forEach(node => node.compositionLevel = 0);
                switch (this.defaultCompositionType) {
                    case compositionTypeEnum.IN:
                        this.hs = this.apiFilter.getLinksListWithMatchingFilterIn(gr.alllinks);
                        break;
                    case compositionTypeEnum.OUT:
                        this.hs = this.apiFilter.getLinksListWithMatchingFilterOut(gr.alllinks);
                        break;
                    case compositionTypeEnum.IN_OUT:
                        this.hs = this.apiFilter.getLinksListWithMatchingFilterInOut(gr.alllinks);
                        break;
                }
                //Found all the nodes which are linked to one of those nodes
                this.hs.forEach(
                    d => gr.allnodes.forEach(node => {
                            if ((ApiFilter.matchesFilter(node.name, d.source) || (ApiFilter.matchesFilter(node.name, d.target))) && !this.nodesList.includes(node)) {
                                node.compositionLevel = 1;
                                this.nodesList.push(node);
                                current.push(node.name);
                            }
                        }
                    )
                );
            }
            this.nodes_dict[1] = this.nodesList.length;
            this.links_dict[1] = this.hs.length;

            var next = [];
            var links = []
            var compositionLevel = 2;
            while (current.length !== 0) {
                switch (this.defaultCompositionType) {
                    case compositionTypeEnum.IN:
                        links = this.apiFilter.getLinksListWithMatchingFiltersIn(gr.alllinks, current);
                        break;
                    case compositionTypeEnum.OUT:
                        links = this.apiFilter.getLinksListWithMatchingFiltersOut(gr.alllinks, current);
                        break;
                    case compositionTypeEnum.IN_OUT:
                        links = this.apiFilter.getLinksListWithMatchingFiltersInOut(gr.alllinks, current);
                        break;
                }

                //links = this.apiFilter.getLinksListWithMatchingFilters(gr.alllinks, current);
                links.forEach(
                    d => gr.allnodes.forEach(node => {

                        if ((ApiFilter.matchesFilter(node.name, d.source) || (ApiFilter.matchesFilter(node.name, d.target))) && !this.nodesList.includes(node)) {
                            node.compositionLevel = compositionLevel;
                            this.nodesList.push(node);
                            this.hs.push(d);
                            next.push(node.name);
                        }
                    })
                );
                this.nodes_dict[compositionLevel] = this.nodesList.length;
                this.links_dict[compositionLevel] = this.hs.length;
                //this.hs.push.apply(this.hs, links)
                current = next;
                next = [];
                compositionLevel++;
            }
            this.setMaxCompositionLevel(this);
            this.firstLevelComposition = false;
        }else{
            document.getElementById("compositionLevel").style.display = "none";
        }
    }

    setDataToDisplay(nodesList, alllinks, compositionLevel) {
        this.graph.allnodes = nodesList.splice(0, this.nodes_dict[compositionLevel]);
        this.graph.alllinks = alllinks.splice(0, this.links_dict[compositionLevel]);
    }

    setMaxCompositionLevel(graphcomposition) {
        var options = {
            minimum: 1,
            maximize: this.nodesList[this.nodesList.length - 1].compositionLevel,
            onChange: async function (e) {
                var nodes_graph = [...graphcomposition.nodesList];
                var links_graph = [...graphcomposition.hs];
                if(graphcomposition.firstLevelComposition) {
                    graphcomposition.setDataToDisplay(nodes_graph, links_graph, graphcomposition.defaultCompositionLevel);
                }
                else graphcomposition.setDataToDisplay(nodes_graph, links_graph, e);
                if (!graphcomposition.firstLevelComposition) graphcomposition.update();
            },
            onMinimum: function (e) {
                //console.log('reached minimum: '+e)
            },
            onMaximize: function (e) {
                //console.log('reached maximize'+e)
            }
        }
        $('#handleCounter').handleCounter(options);
    }


    //	general update pattern for updating the graph

    update() {

        //	UPDATE
        this.node = this.node.data(this.graph.allnodes, function (d, nodeList) {
            return d.name;
        });
        //	EXIT
        this.node.exit().remove();
        //	ENTER
        var newNode = this.node.enter().append("circle")
            .attr("class", "node")
            .style("stroke-dasharray", function (d) {
                return d.types.includes("ABSTRACT") ? "3,3" : "3,0"
            })
            //.style("stroke", "black")

            //On api classes
            .style("stroke", (d) => {
                return this.apiList.includes(d) ? '#0e90d2' : d.types.includes('PUBLIC') ? d3.rgb(this.getPerimeterColor(d.methodPublics)) : "black";
                //return d.types.includes("INTERFACE") ? d3.rgb(0, 0, 0) : d3.rgb(this.getNodeColor(d.name, d.constructorVariants))
            })
            .style("stroke-width", function (d) {
                if (d.types.includes('PUBLIC')) {
                    //return d.types.includes('PUBLIC') ? d3.rgb(0,0,255) : d3.rgb(0,0,0)
                    //return d.methodPublics;
                    var temp = d.methodPublics;
                    return temp < 5 ? 1 : temp * 0.2;
                    //return temp * 0.2;
                } else {
                    return d.types.includes("ABSTRACT") ? d.classVariants + 1 : d.classVariants;
                }
            })
            //.style("stroke", function (d) {
            //  return this.nodesList.contains(d) ? d3.rgb(255, 255, 255): d3.rgb(this.getNodeColor(d.name, d.types, d.constructorVariants)) ;
            //})
            .attr("r", function (d) {
                return d.radius
            })
            .attr("fill", (d) => {
                return d.types.includes("INTERFACE") ? d3.rgb(0, 0, 0) : (d.types.includes("METHOD_LEVEL_VP") || d.types.includes("VARIANT") || d.types.includes("VP")) ? d3.rgb(this.getNodeColor(d.name, d.constructorVariants)) : '#dddddd';
            })
            .attr("name", function (d) {
                return d.name
            });

        newNode.append("title").text(function (d) {
            return d.types.includes('PUBLIC') && d.methodPublics !== undefined && d.allMethods !== undefined ? "types: " + d.types + "\n" + "name: " + d.name + "\n" + "About " + Math.round(((d.methodPublics / d.allMethods) * 100))
                + "% of public methods." + "\n" + d.allMethods + " methods " + "\n" + d.methodPublics + " public methods" : "types: " + d.types + "\n" + "name: " + d.name;
        });
        newNode.on("mouseover", function () {
            d3.select(this).style("cursor", "pointer");
        });
        newNode.on("click", function (d) {
            navigator.clipboard.writeText(d.name).then(function () {
                console.log("COPY OK");
            }, function () {
                console.log("COPY NOT OK");
            });
        });

        //	ENTER + UPDATE
        this.node = this.node.merge(newNode);

        //	UPDATE
        this.link = this.link.data(this.graph.alllinks, function (d) {
            return d.name;
        });
        //	EXIT
        this.link.exit().remove();
        //	ENTER
        var newLink = this.link.enter().append("line")
            .attr("stroke-dasharray", 10)
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
        this.link = this.link.merge(newLink);

        //  UPDATE
        this.label = this.label.data(this.graph.allnodes, function (d) {
            return d.name;
        });
        //	EXIT
        this.label.exit().remove();
        //  ENTER
        var newLabel = this.label.enter().append("text")
            .attr("dx", -5)
            .attr("dy", ".35em")
            .attr("name", d => d.name)
            .attr("fill", (d) => {
                var nodeColor = d.types.includes("INTERFACE") ? d3.rgb(0, 0, 0) : d3.rgb(this.getNodeColor(d.name, d.constructorVariants));
                return contrastColor(nodeColor);
            })
            .text(function (d) {
                return ["STRATEGY", "FACTORY", "TEMPLATE", "DECORATOR"].filter(p => d.types.includes(p)).map(p => p[0]).join(", ");
            });

        //	ENTER + UPDATE
        this.label = this.label.merge(newLabel);

        d3.selectAll("circle.node").on("contextmenu", async (node) => {
            d3.event.preventDefault();
            await this.filter.addFilterAndRefresh(d3.select(node).node().name);
        });

        //this.nodesList.forEach()

        this.addAdvancedBehaviour(newNode, this.width, this.height);


    }

    addAdvancedBehaviour(newNode, width, height) {
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
            .nodes(this.graph.allnodes)
            //	tick event handler with bounded box
            .on("tick", () => {
                this.node
                    // .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
                    // .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });

                this.link
                    .attr("x1", function (d) {
                        if(d.type.includes("INSTANCIATE")){
                            return d.target.x;
                        }else{
                            return d.source.x
                        }
                    })
                    .attr("y1", function (d) {
                        if(d.type.includes("INSTANCIATE")){
                            return d.target.y
                        }else{
                            return d.source.y
                        }
                    })
                    .attr("x2", function (d) {
                        if(d.type.includes("INSTANCIATE")){
                            return d.source.x
                        }else{
                            return d.target.x
                        }
                    })
                    .attr("y2", function (d) {
                        if(d.type.includes("INSTANCIATE")){
                            return d.source.y
                        }else{
                            return d.target.y
                        }
                    });

                this.label
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    });
            });

        simulation.force("link")
            .links(this.graph.alllinks);

        simulation.alpha(1).alphaTarget(0).restart();

        //add zoom capabilities
        var zoom_handler = d3.zoom()
            .on("zoom", () => this.g.attr("transform", d3.event.transform));

        zoom_handler(this.svg);

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
    }

    getNodeColor(nodeName, valueOnScale) {
        var upperRangeColor = this.packageColorer.getColorForName(nodeName);
        return this.color
            .range(["#FFFFFF", upperRangeColor])
            .interpolate(d3.interpolateRgb)(valueOnScale);
    }

    getPerimeterColor(valueOnScale) {
        var upperRangeColor = "#40E0D0";
        if (valueOnScale === undefined) return upperRangeColor;
        return this.color
            .range(["#FFFFFF", upperRangeColor])
            .interpolate(d3.interpolateRgb)(valueOnScale);
    }

    setButtonsClickActions() {
        $(document).on('click', ".list-group-item", e => {
            e.preventDefault();
            $('.active').removeClass('active');
        });

        $(document).on('change', "#composition-type", async e => {
            e.preventDefault();
            this.defaultCompositionType = $(e.target).val();
            await this.displayGraph();
        });

        $(document).on('change', "#hybridSwitch", async e => {
            e.preventDefault();
            //this.defaultCompositionType = $(e.target).val();
            if($(e.target).val() === 'off') {
                $(e.target).val('on');
                this.hybridView = true;
            }
            else {
                $(e.target).val('off');
                this.hybridView = false;
            }
            console.log($(e.target).val());
            await this.displayGraph();
        });

        $("#filter-isolated").on('click', async e => {
            e.preventDefault();
            var previouslyFiltered = sessionStorage.getItem("filteredIsolated") === "true";
            sessionStorage.setItem("filteredIsolated", previouslyFiltered ? "false" : "true");
            $("#filter-isolated").text(previouslyFiltered ? "Unfilter isolated nodes" : "Filter isolated nodes");
            await this.displayGraph();
        });

        $("#filter-variants-button").on('click', async e => {
            e.preventDefault();
            console.log(sessionStorage.getItem("filteredVariants"));
            var previouslyFiltered = sessionStorage.getItem("filteredVariants") === "true";
            sessionStorage.setItem("filteredVariants", previouslyFiltered ? "false" : "true");
            $("#filter-variants-button").text(previouslyFiltered ? "Hide variants" : "Show variants");
            await this.displayGraph();
        });

        $('#hide-info-button').click(function () {
            $(this).text(function (i, old) {
                return old === 'Show project information' ? 'Hide project information' : 'Show project information';
            });
        });

        $('#hide-legend-button').click(function () {
            $(this).text(function (i, old) {
                return old === 'Hide legend' ? 'Show legend' : 'Hide legend';
            });
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

export {Graph};