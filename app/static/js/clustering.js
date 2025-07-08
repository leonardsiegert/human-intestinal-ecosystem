if (window.frameElement) {
    document.getElementsByClassName("title")[0].remove();
    d3.select(".site-header").style("display", "none");
    d3.select("#resetSelection").style("visibility", "hidden");
    d3.select("#resetSelection").style("max-height", 0);
    // add a link to the h2.subtitle
    d3.select("h2.subtitle")
        .style("hover", "text-decoration: underline;")
        .on("click", () => {
            window.top.location.href = "/clustering";
        })
        // when hovering over the subtitle, underline it and change cursor
        .style("cursor", "pointer")
        .on("mouseover", function () {
            d3.select(this)
                .style("text-decoration", "underline");
        })
        .on("mouseout", function () {
            d3.select(this)
                .style("text-decoration", "none");
        });
}

d3.csv(dataset).then(function (data) {
    //////////////////////////////////////////////////////////////////////////////////////////////////
    ///////  VARIABLE DECLARATIONS  //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // helper function equivalent to numpy.unique()
    function unique(arr) {
        return arr.filter((value, index, self) => self.indexOf(value) === index);
    }

    // define all the sizes
    const container = document.getElementById('clusterContent');
    const containerWidth = container.clientWidth;
    const baseWidth = 500;
    const scaleFactor = containerWidth / baseWidth;

    // Use smaller margins on mobile
    function checkMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Check for common mobile indicators in the user agent string
        const isTouchDevice =
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0;

        const isMobileUserAgent = /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini/i.test(userAgent);

        return isMobileUserAgent || isTouchDevice;
    }
    const isMobile = checkMobile();

    const margin = isMobile
        ? {
            top: 15 * scaleFactor,
            bottom: 25 * scaleFactor,
            left: 20 * scaleFactor,
            right: 20 * scaleFactor
        } : {
            top: 20 * scaleFactor,
            bottom: 0,
            left: 20 * scaleFactor,
            right: 20 * scaleFactor
        };
    const svgWidth = containerWidth - margin.left - margin.right;
    const svgHeight = 300 * scaleFactor; // keep aspect ratio as needed
    bubbleRadius = 5 * scaleFactor;

    // set the initial cluster properties
    let selectedClusters = [];
    clusterMethods = ["dbscan", "kmeans_4", "kmeans_8"];
    clusterMethod = clusterMethods[0];
    clusterMethodNames = ["DBSCAN", "K-Means [k=4]", "K-Means[k=8]"];
    clusterMethodsInfo = {
        "dbscan": "A density-based clustering method. No pre-determined number of clusters. The gray cluster (cluster -1) represents the data classified as noise.",
        "kmeans_4": "A nearest-neighbour-based clustering method. The number of clusters is set manually.",
        "kmeans_8": "A nearest-neighbour-based clustering method. The number of clusters is set manually."
    };
    let clusterLabels = data.map(d => parseFloat(d[clusterMethod]));
    let minCluster = d3.min(clusterLabels);
    let maxCluster = d3.max(clusterLabels);
    let uniqueClusters = unique(clusterLabels);
    let numClusters = uniqueClusters.length;
    // // incorporate an existing sample selection
    checkIfClustersSelected();

    // set the initial dimensionality reduction properties
    DRMethods = ["pca", "kernel_pca", "tsne"];
    DRMethod = DRMethods[0];
    DRMethodNames = ["PCA", "Kernel PCA", "t-SNE"];
    DRMethodsInfo = {
        "pca": "A linear dimensionality reduction method minimizing the variance of the data and mapping it onto its first 2 components.",
        "kernel_pca": "A non-linear dimensionality reduction method minimizing the variance of the data and mapping it onto its first 2 components.",
        "tsne": "A non-linear dimensionality reduction method optimizing a probability distribution representing similarity between the samples."
    };
    DR_x = "x_" + DRMethod;
    DR_y = "y_" + DRMethod;
    let minX = d3.min(data, function (d) { return parseFloat(d[DR_x]); });
    let maxX = d3.max(data, function (d) { return parseFloat(d[DR_x]); });
    let minY = d3.min(data, function (d) { return parseFloat(d[DR_y]); });
    let maxY = d3.max(data, function (d) { return parseFloat(d[DR_y]); });
    let scaleX = d3.scaleLinear().domain([minX, maxX]).range([0, svgWidth]);
    let scaleY = d3.scaleLinear().domain([minY, maxY]).range([svgHeight, 0]);


    // create the SVG
    let svg = d3.select("#clusterPlot")
        .attr("width", svgWidth + margin.right + margin.left)
        .attr("height", svgHeight + margin.top + margin.bottom);

    // set a color scheme for the clusters
    let colorCircle = setColors();

    // draw the chart and corresponding elements
    drawXaxis();
    drawYaxis();
    let chart = drawBubbleChart();
    let legend = drawLegend();
    reAssignOpacity();


    // header with buttons and infobox
    d3.select("#clusterHeader")
        .style("margin-left", margin.left + "px")
        .style("margin-top", window.frameElement ? 0 : margin.top + "px")
        // .style("margin-top", margin.top + "px")
        .style("width", svgWidth + "px");

    // InfoBox
    d3.select("#clusterInfoBox")
        .style("background", "rgb(185, 205, 207)")
        .style("border", "solid")
        .style("border-radius", "1.5rem")
        .style("padding", "0rem")
        .style("padding-left", "0.5rem")
        .style("padding-right", "0.5rem");
    d3.select("#clusterInfoBox")
        .append("h3")
        .attr("id", "clusterInfoBoxHead1")
        .style("margin", "0rem")
        .style("margin-top", "0.5rem")
        .style("padding", "0rem");
    d3.select("#clusterInfoBox")
        .append("p")
        .attr("id", "clusterInfoBox1")
        .style("margin", "0rem")
        .style("padding", "0rem");
    d3.select("#clusterInfoBox")
        .append("h3")
        .attr("id", "clusterInfoBoxHead2")
        .style("margin", "0rem")
        .style("margin-top", "0.5rem")
        .style("padding", "0rem");
    d3.select("#clusterInfoBox")
        .append("p")
        .attr("id", "clusterInfoBox2")
        .style("margin", "0rem")
        .style("margin-bottom", "0.5rem")
        .style("padding", "0rem");

    changeInfoBox();



    //////////////////////////////////////////////////////////////////////////////////////////////////
    ///////  FUNCTIONS FOR DRAWING  //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////


    function setColors() {
        let myColors = ['#CC6677', '#332288', '#DDCC77', '#117733', '#88CCEE', '#882255', '#44AA99', '#999933', '#AA4499', '#DDDDDD']
        // Have grey be the first color of the scheme
        if (clusterMethod === "dbscan") {
            let grey = myColors.splice(9, 1)[0];
            myColors.unshift(grey);
        }
        return d3.scaleOrdinal()
            .domain([minCluster, maxCluster])
            .range(myColors);
    }

    // append the X-axis
    function drawXaxis() {
        svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(" + margin.left + "," + (svgHeight + margin.top + bubbleRadius) + ")")
            .call(d3.axisBottom(scaleX).tickSize(0).tickFormat(""))
            ;
        // append axis label
        svg.append("text")
            .attr("class", "xlabel")
            .attr("x", margin.left + svgWidth)
            .attr("y", svgHeight + margin.top + bubbleRadius * 4)
            .attr("text-anchor", "end")
            .text("component 1");
    }

    function drawYaxis() {
        // append the Y-axis
        svg.append("g")
            .attr("class", "yaxis")
            .attr("transform", "translate(" + (margin.left - bubbleRadius) + "," + (margin.top) + ")")
            .call(d3.axisLeft(scaleY).tickSize(0).tickFormat(""));

        // append axis label
        svg.append("text")
            .attr("class", "ylabel")
            .attr("x", margin.left)
            .attr("y", margin.top + bubbleRadius)
            .text("component 2");
    }


    // create the bubble chart and append it to the SVG
    function drawBubbleChart() {
        svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("stroke", "black")
            .selectAll(".clusterCircles")
            .data(data)
            .enter()
            .append("circle")
            .style("cursor", "pointer")
            .attr("class", "clusterCircles")
            .attr("opacity", "0.9")
            .attr("cx", function (d) {
                return scaleX(d[DR_x]);
            })
            .attr("cy", function (d) {
                return scaleY(d[DR_y]);
            })
            .attr("r", bubbleRadius)
            .attr("fill", function (d) {
                return colorCircle(parseFloat(d[clusterMethod]));
            })
            .on("click", function (event, d) {
                // add or remove cluster from selection, and redo bubble highlighting
                changeClusterSelection(parseFloat(d[clusterMethod]));
                reAssignOpacity();
            });;
    }

    function drawLegend() {
        let legendX = svgWidth / numClusters;
        let legendRadius = 15;
        svg.append("g")
            .attr("class", "legend")
            .selectAll(".legend")
            .data([... new Set(d3.sort(data.map(d => parseFloat(d[clusterMethod]))))])
            .enter()
            .each(function (d, i) {
                d3.select(this)
                    .append("circle")
                    .style("cursor", "pointer")
                    .attr("class", "legendCircles")
                    .attr("cx", i * legendX + margin.left + legendRadius * 2)
                    .attr("cy", margin.top + svgHeight + legendRadius * 2.5)
                    .attr("r", legendRadius)
                    .attr("fill", colorCircle(d))
                    .on("click", function (event, d) {
                        // add or remove cluster from selection, and redo bubble highlighting
                        changeClusterSelection(d);
                        reAssignOpacity();
                    });

                d3.select(this).append("text")
                    .attr("class", "legendText")
                    .attr("transform", "translate(" + (i * legendX + margin.left) + ", " + (margin.top + svgHeight + legendRadius * 5) + ")" + "rotate(-20)")
                    .attr("text-align", "right")
                    .style("cursor", "pointer")
                    .text(d => "cluster " + d)
                    .on("click", function (event, d) {
                        // add or remove cluster from selection, and redo bubble highlighting
                        changeClusterSelection(d);
                        reAssignOpacity();
                    });
            })
            ;
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////
    ///////  FUNCTIONS FOR INTERACTIVITY  ////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // sets the storage['indices'] to the given parameter
    function setSessionStorage(selectedIndices) {
        sessionStorage.setItem("indices", JSON.stringify(unique(selectedIndices)));
        // in side-by-side mode, update the other plots too
        if (window.frameElement) {
            if (selectedIndices.length == 0) {
                parent.document.getElementById("resetSelection").click();
            }
            else { parent.document.getElementById("updateData").click(); }
        }
    }

    // sessionStorage["indices"] getter method
    function getSessionStorage() {
        let mySession = JSON.parse(sessionStorage.getItem("indices"));
        if (mySession === null) {
            return [];
        } else {
            return mySession;
        }
    }

    // checks if clusters are already selected and updates selectedClusters accordingly
    function checkIfClustersSelected() {
        // only does something if there are indices selected
        let currSession = getSessionStorage();
        if (currSession.length !== 0) {
            selectedClusters = uniqueClusters.slice();
            // loop through all data and check if the indices are contained in session
            for (let i = 0; i < data.length; i++) {
                // if session doesn't include index and it hasn't been removed already
                // , remove the respective cluster
                if (!currSession.includes(parseFloat(data[i][""]))) {
                    let indexOfCluster = selectedClusters.indexOf(parseFloat(data[i][clusterMethod]));
                    if (indexOfCluster !== -1) {
                        selectedClusters.splice(indexOfCluster, 1);
                    }
                }
            }
        }
    }

    // when called by clicking on legend, adds/removes clicked cluster to/from cluster selection
    function changeClusterSelection(clickedCluster) {
        indices = getSessionStorage();
        if (selectedClusters.includes(clickedCluster)) {
            // remove cluster from selection if there already
            selectedClusters.splice(selectedClusters.indexOf(clickedCluster), 1);
            data.forEach((d, i) => parseFloat(d[clusterMethod]) === clickedCluster ? indices.splice(indices.indexOf(i), 1) : null);
        } else {
            // add cluster to selection if not there yet
            selectedClusters.push(clickedCluster);
            data.forEach((d, i) => selectedClusters.includes(parseFloat(d[clusterMethod])) ? indices.push(i) : null);
        }
        setSessionStorage(indices);

    }

    // highlight the selected clusters - to be called due to cluster selection
    function reAssignOpacity() {
        let currSession = getSessionStorage();
        d3.select("#clusterPlot").transition().duration(250)
            .selectAll(".clusterCircles")
            .attr("opacity", function (d) {
                if (currSession.length === 0 || currSession.includes(parseFloat(d[""]))) {
                    return "0.9";
                } else {
                    return "0.2";
                }
            });
        d3.selectAll(".legendCircles")
            .attr("opacity", function (d) {
                if (selectedClusters.length === 0 || selectedClusters.includes(d)) {
                    return "0.9";
                } else {
                    return "0.2";
                }
            });
    }

    // assign each circle a new cluster and redraw the legend
    // to be called when changing clustering_method
    function reAssignClusters(selectedCluster) {
        clusterMethod = selectedCluster;
        clusterLabels = data.map(d => parseFloat(d[clusterMethod]));
        uniqueClusters = unique(clusterLabels);
        numClusters = uniqueClusters.length;
        minCluster = d3.min(data, function (d) { return parseFloat(d[clusterMethod]); });
        maxCluster = d3.max(data, function (d) { return parseFloat(d[clusterMethod]); });
        colorCircle = d3.scaleOrdinal()
            .domain([minCluster, maxCluster])
            .range(d3.schemeCategory10);

        checkIfClustersSelected();

        // change the colors of the cluster circles
        colorCircle = setColors();
        d3.select("#clusterPlot")
            .selectAll(".clusterCircles")
            .attr("fill", function (d) {
                return colorCircle(parseFloat(d[clusterMethod]));
            });

        // redraw the legend
        d3.selectAll(".legendCircles").remove();
        d3.selectAll(".legendText").remove();
        legend = drawLegend();

        // select and deselect clusters
        reAssignOpacity();

        // change the InfoBox
        changeInfoBox();
    }

    // change method of dimensionality reduction, and recalculate positions
    function changeDimRedMethod(selectedDimRed) {
        // recalculate scales and sizes
        DRMethod = selectedDimRed
        DR_x = "x_" + DRMethod
        DR_y = "y_" + DRMethod
        minX = d3.min(data, function (d) { return parseFloat(d[DR_x]); });
        maxX = d3.max(data, function (d) { return parseFloat(d[DR_x]); });
        minY = d3.min(data, function (d) { return parseFloat(d[DR_y]); });
        maxY = d3.max(data, function (d) { return parseFloat(d[DR_y]); });
        scaleX = d3.scaleLinear().domain([minX, maxX]).range([0, svgWidth]);
        scaleY = d3.scaleLinear().domain([minY, maxY]).range([svgHeight, 0]);
        // redraw axes
        d3.select(".xaxis").remove();
        d3.select(".xlabel").remove();
        d3.select(".yaxis").remove();
        d3.select(".ylabel").remove();
        drawXaxis();
        drawYaxis();
        // reassign x and y positions of bubbles
        reAssignPositions();
        // change InfoBox
        changeInfoBox();
    }

    //  move circles to new position - to be called when changing DRMethod
    function reAssignPositions() {
        d3.select("#clusterPlot").transition().duration(250)
            .selectAll(".clusterCircles")
            .attr("cx", function (d) {
                return scaleX(d[DR_x]);
            })
            .attr("cy", function (d) {
                return scaleY(d[DR_y]);
            });
    }

    function changeInfoBox() {
        // choose the appropriate text options
        let text1;
        let text2;
        // text for clustering method
        if (clusterMethod === "dbscan") {
            text1 = clusterMethodsInfo["dbscan"];
        } else if (clusterMethod === "kmeans_4") {
            text1 = clusterMethodsInfo["kmeans_4"];
        } else if (clusterMethod === "kmeans_8") {
            text1 = clusterMethodsInfo["kmeans_8"];
        } else {
            console.log("PROBLEM: clusterMethod not recognized by changeInfoBox()!!");
        }
        // text for dimensionality reduction method
        if (DRMethod === "pca") {
            text2 = DRMethodsInfo["pca"];
        } else if (DRMethod === "kernel_pca") {
            text2 = DRMethodsInfo["kernel_pca"];
        } else if (DRMethod === "tsne") {
            text2 = DRMethodsInfo["tsne"];
        } else {
            console.log("PROBLEM: DRMethod not recognized by changeInfoBox()!!");
        }
        d3.select("#clusterInfoBoxHead1").text(clusterMethodNames[clusterMethods.indexOf(clusterMethod)] + ":");
        d3.select("#clusterInfoBoxHead2").text(DRMethodNames[DRMethods.indexOf(DRMethod)] + ":");
        d3.select("#clusterInfoBox1").text(text1);
        d3.select("#clusterInfoBox2").text(text2);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    ///////  BUTTONS AND InfoBox /////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////


    // Reset Buttom for Sample Selection
    d3.select("#resetSelection")
        .on("click", function (event) {
            sessionStorage.removeItem("indices");
            selectedClusters = [];
            reAssignOpacity();
        });

    // Dropdown button to re-assign Clusters
    d3.select("#reAssignClusters")
        .selectAll('myOptions')
        .data(clusterMethods)
        .enter()
        .append('option')
        .text(function (d) { return clusterMethodNames[clusterMethods.indexOf(d)]; }) // text shown in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        .on("click", function (event) {
            let selectedCluster = d3.select(this).property("value");
            reAssignClusters(selectedCluster);
        })
        ;
    d3.select("#reAssignClusters")
        .on("change", function (event) {
            let selectedCluster = d3.select(this).property("value");
            reAssignClusters(selectedCluster);
        });
    // Button to change method of dimensionality reduction
    d3.select("#changeDimRedMethod")
        .selectAll('myOptions')
        .data(DRMethods)
        .enter()
        .append('option')
        .text(function (d) { return DRMethodNames[DRMethods.indexOf(d)]; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        .on("click", function (event) {
            let selectedDimRed = d3.select(this).property("value");
            changeDimRedMethod(selectedDimRed);
        })
        ;
    d3.select("#changeDimRedMethod")
        .on("change", function (event) {
            let selectedDimRed = d3.select(this).property("value");
            changeDimRedMethod(selectedDimRed);
        });

}, function (reason) {
    console.log(reason);
    d3.select("body")
        .append("p")
        .text("Failed to load data, see console!")
})