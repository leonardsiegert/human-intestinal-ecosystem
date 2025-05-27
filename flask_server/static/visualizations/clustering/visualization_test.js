d3.csv(dataset).then(function(dataset){
    // define all the sizes and scales
    const svgWidth = 800;
    const svgHeight = 300;
    const margin = { top: 50, bottom: 100, left: 50, right: 50 };
    let cluster_labels = dataset.map(d => d["cluster"]);
    let data_x = dataset.map(d => d["x"]);
    let data_y = dataset.map(d => d["y"]);
    let minCluster = d3.min(dataset, function (d) { return parseFloat(d["cluster"]); });
    let maxCluster = d3.max(dataset, function (d) { return parseFloat(d["cluster"]); });
    let minX = d3.min(dataset, function (d) { return parseFloat(d["x"]); });
    let maxX = d3.max(dataset, function (d) { return parseFloat(d["x"]); });
    let minY = d3.min(dataset, function (d) { return parseFloat(d["y"]); });
    let maxY = d3.max(dataset, function (d) { return parseFloat(d["x"]); });
    let scaleX = d3.scaleLinear().domain([minX, maxX]).range([0, svgWidth]);
    let scaleY = d3.scaleLinear().domain([minY, maxY]).range([svgHeight, 0]);


    // create the SVG
    let svg = d3.select("#cluster_plot")
        .attr("width", svgWidth + margin.right + margin.left)
        .attr("height", svgHeight + margin.top + margin.bottom);
    
    // append the X-axis
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + (svgHeight + margin.top) + ")")
        // .text("Happiness")
        .call(d3.axisBottom(scaleX));
    
    // append the Y-axis
    svg.append("g")
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")")
    .call(d3.axisLeft(scaleY));

    // assign the color according to the cluster
    let colorCircle = d3.scaleOrdinal()
        .domain([minCluster,maxCluster])
        .range(d3.schemeCategory10);

    // create the bubble chart and append it to the SVG
    let chart = svg.append("g")
        .attr("transform", "translate("+margin.left+","+margin.top+")")
        .attr("stroke", "black")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("opacity", "1.0")
        .attr("cx",function(d){
            return scaleX(d["x"]);
        })
        .attr("cy", function(d){
            return scaleY(d["y"]);
        })
        .attr("r", 5) // radius has no relevance yet
        .attr("fill", function(d){
            return colorCircle(d["cluster"]);
        });

    let legend = svg.append("g")
        .selectAll("g")
        .data([... new Set(dataset.map(d => d["cluster"]))])
        .enter()
        .each(function (d, i) {
            var g = d3.select(this);
            var legwidth = 100;
            var legheight = 10;
            g.append("circle")
                .attr("cx", i * legwidth + 20)
                .attr("cy", (margin.top * 2 + svgHeight))
                .attr("r", 10)
                .attr("fill", colorCircle(d))
                .on("click", function(event, d){
                    changeX(d);
                });

            g.append("text")
                .attr("x", i * legwidth +10)
                .attr("y", (margin.top * 2 + svgHeight) + legheight + 10)
                .text(d => "cluster "+d);
        })
        .append("text")
        .attr("x", 20)
        .attr("y", (margin.top * 2 + svgHeight) + 30);
        
        d3.select("#button")
        .style("visibility", "visible")
        .on("click", function(event){
            d3.select("#button")
            .append("p")
         //   .text("Button not yet implemented.");
            var test =  parent.leftvis.window.document.getElementById("ButtonSB").click()})
    
        
        selectedClusters = [];
    function changeX(d){
        if (selectedClusters.includes(d)) {
            // remove cluster from selection if there already
            selectedClusters.splice(selectedClusters.indexOf(d), 1);
        } else {
            // add cluster to selection if not there yet
            selectedClusters.push(d);
        }

        // highlight the selected clusters
        d3.select("svg").transition().duration(250)
            .selectAll("circle")
            .attr("opacity", function (d) {

                if (selectedClusters.length == 0) {
                    return "1";
                } else if (selectedClusters.includes(d["cluster"]) || selectedClusters.includes(d)) {
                    return "1";
                } else {
                    return "0.2";
                }
            });
        
        // reveal button that opens selected clusters in metadata overview
        if (selectedClusters.length > 0){
            indices = []
            cluster_labels.forEach((cluster, index) => selectedClusters.includes(cluster) ? indices.push(index): null);
            d3.select("#button")
            .style("visibility", "visible")
            .on("click", function(event){
                d3.select("#button")
                .append("p")
             //   .text("Button not yet implemented.");
                var test =  parent.leftvis.window.document.getElementById("ButtonSB").click()
                //d3.selectAll("#ButtonSB").click()
               // parent.d3.selectAll("#test").html("color")
            //    test.style.color = 'red';
                });
        }else{
            d3.select("#button")
                .style("visibility", "hidden");
        }
    }
        
}, function(reason){
    console.log(reason);
    d3.select("body")
    .append("p")
    .text("Failed to load dataset, see console!")
})