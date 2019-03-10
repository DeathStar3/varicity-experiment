//	data stores
var graph, store;

function displayGraph(jsonFile, jsonStatsFile){
    d3.selectAll("svg > *").remove();
    generateGraph(jsonFile, jsonStatsFile);
}

function generateGraph(jsonFile, jsonStatsFile){
    // document.getElementsByTagName("svg")[0].innerHTML = "";

    var difference = [];

    var width = window.innerWidth,
        height = window.innerHeight - 10;


    //	svg selection and sizing
    var svg = d3.select("svg").attr("width", width).attr("height", height);
    var radius = 10;

    //	d3 color scales
    var color = d3.scaleLinear()
        .range(["#FFFFFF", '#FF0000'])
        .interpolate(d3.interpolateRgb);

    //add encompassing group for the zoom
    var g = svg.append("g")
        .attr("class", "everything");

    var link = g.append("g").selectAll(".link"),
        node = g.append("g").selectAll(".node"),
        label = g.append("g").selectAll(".label");

    //	force simulation initialization
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().distance(100)
            .id(function(d) { return d.name; }))
        .force("charge", d3.forceManyBody()
            .strength(function(d) { return -50;}))
        .force("center", d3.forceCenter(width / 2, height / 2));
    // console.log(simulation);

    //	filtered types
    typeFilterList = [];

    //	filter button event handlers
    $(".filter-btn").on("click", function() {
        var id = $(this).attr("value");
        if (typeFilterList.includes(id)) {
            typeFilterList.splice(typeFilterList.indexOf(id), 1)
        } else {
            typeFilterList.push(id);
        }
        filter(id);
        update();
    });

    //	data read and store
    d3.json(jsonFile, function(err, g) {

        d3.json(jsonStatsFile, function(err, stats){
            var statisticsContent =
                "Number of constructor overloards: "+ stats["constructorsOverloads"] + "<br>" +
                "Number of methods overloards: "+ stats["methodsOverloads"] + "<br>" +
                "Number of method level overloards: "+ stats["methodLevelOverloads"] + "<br>" +
                "Number of class level overloards: "+ stats["classLevelOverloads"] + "<br>" +
                "Number of design patterns overloards: "+ stats["designPatterns"];
            console.log(statisticsContent);
            document.getElementsByTagName("p")[0].innerHTML = statisticsContent;

        });

        if (err) throw err;

        var sort = g.nodes.filter(a => a.type.includes("CLASS")).map(a => parseInt(a.intensity)).sort((a, b) => a - b);
        color.domain([sort[0]-3, sort[sort.length - 1]]); // TODO deal with magic number

        var nodeByID = {};

        g.nodes.forEach(function(n) {
            nodeByID[n.name] = n;
        });

        g.links.forEach(function(l) {
            l.sourceTypes = nodeByID[l.source].type;
            l.targetTypes = nodeByID[l.target].type;
        });

        graph = g;
        store = $.extend(true, {}, g);

        update();
    });

    //	general update pattern for updating the graph
    function update() {
        //	UPDATE
        node = node.data(graph.nodes, function(d) { return d.name;});
        //	EXIT
        node.exit().remove();
        //	ENTER
        var newNode = node.enter().append("g").append("circle")
            .attr("class", "node")
            .style("stroke", function (d) {return d.type.includes("ABSTRACT") ? "black" : "none"})
            .attr("r", function (d) {return d.type.includes("CLASS") ? 10 + d.nodeSize : 10})
            .attr("fill", function (d) {return d.type.includes("INTERFACE") ? d3.rgb(0, 0, 0) : d3.rgb(color(d.intensity))})
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

        //Zoom functions
        function zoom_actions(){
            g.attr("transform", d3.event.transform)
        }

        //add zoom capabilities
        var zoom_handler = d3.zoom()
            .on("zoom", zoom_actions);

        zoom_handler(svg);

        newNode.append("title").text(function(d) { return "type: " + d.type + "\n" + "name: " + d.name; });

        //	ENTER + UPDATE
        node = node.merge(newNode);

        //	UPDATE
        link = link.data(graph.links, function(d) { return d.name;});
        //	EXIT
        link.exit().remove();
        //	ENTER
        newLink = link.enter().append("line")
            .attr("stroke-width", 1)
            .attr("class", "link");

        newLink.append("title")
            .text(function(d) { return "source: " + d.source + "\n" + "target: " + d.target; });
        //	ENTER + UPDATE
        link = link.merge(newLink);

        //  UPDATE
        label = label.data(graph.nodes, function(d) { return d.name;});
        //	EXIT
        label.exit().remove();
        //  ENTER
        var newLabel = label.enter().append("g").append("text")
            .attr("dx", -5)
            .attr("dy", ".35em")
            .attr("fill", function (d) {
                var nodeColor = d.type.includes("INTERFACE") ? d3.rgb(0, 0, 0) : d3.rgb(color(d.intensity));
                return contrastColor(nodeColor);
            })
            .text(function(d) {
                return ["STRATEGY", "FACTORY"].filter(p => d.type.includes(p)).map(p => p[0]).join(", ");
            });

        //	ENTER + UPDATE
        label = label.merge(newLabel);

        //	update simulation nodes, links, and alpha
        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        simulation.alpha(1).alphaTarget(0).restart();
    }

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
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        label
            .attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;});
    }

    //	filter function
    function filter(value) {
        if(value === "ALONE"){
            // Nodes are filtered, need to bring them back
            if( !!difference && difference.length > 0){
                difference.forEach(function(n){
                    graph.nodes.push($.extend(true, {}, n));
                });
                difference = [];
                // Nodes need to be filtered
            } else {
                var tmp = graph;
                var linkedNodes = new Set();
                tmp.links.forEach(l => {
                    linkedNodes.add(l.source);
                    linkedNodes.add(l.target);
                });

                difference = [...tmp.nodes].filter(n => !linkedNodes.has(n));

                difference.forEach(function (n) {
                    graph.nodes.forEach(function(d, i) {
                        if (n.name === d.name) {
                            graph.nodes.splice(i, 1);
                        }
                    });
                });
            }
        } else {
            var matchingNodes = new Set([...store.nodes].map(n => n.name).filter(name => name.startsWith(value)));

            store.nodes.forEach(function(n) {
                if(matchingNodes.has(n.name)){
                    if (n.filtered) {
                        n.filtered = false;
                        graph.nodes.push($.extend(true, {}, n));
                    } else {
                        n.filtered = true;
                        graph.nodes.forEach(function(d, i) {
                            if (n.name === d.name) {
                                graph.nodes.splice(i, 1);
                            }
                        });
                    }
                }
            });

            store.links.forEach(function(l) {
                if((matchingNodes.has(l.source) || matchingNodes.has(l.target))){
                    if (l.filtered) {
                        l.filtered = false;
                        graph.links.push($.extend(true, {}, l));
                    } else {
                        l.filtered = true;
                        graph.links.forEach(function(d, i) {
                            if (l.source == d.source.name && l.target == d.target.name) {
                                graph.links.splice(i, 1);
                            }
                        });
                    }
                }
            });
        }
    }

    function contrastColor(color)
    {
        var d = 0;

        // Counting the perceptive luminance - human eye favors green color...
        const luminance = ( 0.299 * color.r + 0.587 * color.g + 0.114 * color.b)/255;

        if (luminance > 0.5)
            d = 0; // bright colors - black font
        else
            d = 255; // dark colors - white font

        return  d3.rgb(d, d, d);
    }
}
