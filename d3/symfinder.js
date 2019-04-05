//	data stores
var graph, store;

//	filtered types
var filters = [];
var jsonFile, jsonStatsFile;

function displayGraph(jsonFile, jsonStatsFile, nodefilters = []){
    d3.selectAll("svg > *").remove();
    filters = nodefilters;
    this.jsonFile = jsonFile;
    this.jsonStatsFile = jsonStatsFile;
    generateGraph();
}

function generateGraph(){

    var width = window.innerWidth,
        height = window.innerHeight - 10;


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
        .style('stroke','none');

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

    function displayData(){
        //	data read and store
        d3.json(jsonFile, function(err, gr) {

            d3.json(jsonStatsFile, function(err, stats){
                var statisticsContent =
                    "Number of methods VPs: "+ stats["methodsVPs"] + "<br>" +
                    "Number of constructors VPs: "+ stats["constructorsVPs"] + "<br>" +
                    "Number of method level VPs: "+ stats["methodLevelVPs"] + "<br>" +
                    "Number of class level VPs: "+ stats["classLevelVPs"] + "<br>" +
                    "Number of methods variants: "+ stats["methodsVariants"] + "<br>" +
                    "Number of constructors variants: "+ stats["constructorsVariants"] + "<br>" +
                    "Number of method level variants: "+ stats["methodLevelVariants"] + "<br>" +
                    "Number of class level variants: "+ stats["classLevelVariants"];
                document.getElementsByTagName("p")[0].innerHTML = statisticsContent;

            });

            if (err) throw err;

            var sort = gr.nodes.filter(a => a.type.includes("CLASS")).map(a => parseInt(a.intensity)).sort((a, b) => a - b);
            color.domain([sort[0]-3, sort[sort.length - 1]]); // TODO deal with magic number

            var nodeByID = {};


            graph = gr;
            store = $.extend(true, {}, gr);

            graph.nodes.forEach(function(n) {
                n.radius = n.type.includes("CLASS") ? 10 + n.nodeSize : 10;
                nodeByID[n.name] = n;
            });

            graph.links.forEach(function(l) {
                l.sourceTypes = nodeByID[l.source].type;
                l.targetTypes = nodeByID[l.target].type;
            });

            store.nodes.forEach(function(n) {
                n.radius = n.type.includes("CLASS") ? 10 + n.nodeSize : 10;
            });

            store.links.forEach(function(l) {
                l.sourceTypes = nodeByID[l.source].type;
                l.targetTypes = nodeByID[l.target].type;
            });

            graph.nodes = gr.nodes.filter(n => !filters.some(filter => n.name.includes(filter)));
            graph.links = gr.links.filter(l => !filters.some(filter => l.source.includes(filter)) && !filters.some(filter => l.target.includes(filter)));

            update();
        });
    }


    //	general update pattern for updating the graph
    function update() {
        //	UPDATE
        let dataSource = graph;
        node = node.data(dataSource.nodes, function(d) { return d.name;});
        //	EXIT
        node.exit().remove();
        //	ENTER
        var newNode = node.enter().append("g").append("circle")
            .attr("class", "node")
            .style("stroke-dasharray", function (d) {return d.type.includes("ABSTRACT") ? "3,3" : "3,0"})
            .style("stroke", "black")
            .style("stroke-width", function (d) {return d.strokeWidth})
            .attr("r", function (d) {return d.radius})
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
        link = link.data(dataSource.links, function(d) { return d.name;});
        //	EXIT
        link.exit().remove();
        //	ENTER
        newLink = link.enter().append("line")
            .attr("stroke-width", 1)
            .attr("class", "link")
            .attr('marker-start',"url(#arrowhead)")
            .style("pointer-events", "none");

        newLink.append("title")
            .text(function(d) { return "source: " + d.source + "\n" + "target: " + d.target; });
        //	ENTER + UPDATE
        link = link.merge(newLink);

        //  UPDATE
        label = label.data(store.nodes, function(d) { return d.name;});
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
            .nodes(dataSource.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(dataSource.links);

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

    displayData();

}

$(document).on('click', ".list-group-item", function (e) {
    e.preventDefault();
    let removedFilter = $(this).attr("id");
    $(e.target).remove();
    filters.splice(filters.indexOf(removedFilter), 1);
    displayGraph(jsonFile, jsonStatsFile, filters);
});

$("#add-filter-button").on('click', function (e) {
    e.preventDefault();
    let inputValue = $("#package-to-filter").val();
    if(inputValue){
        $("#list-tab").append('<li class="list-group-item" id="'+inputValue+'" data-toggle="list"\n' +
            '               role="tab" aria-controls="profile">'+inputValue+'</li>');
        filters.push(inputValue);
        displayGraph(jsonFile, jsonStatsFile, filters);
    }
});