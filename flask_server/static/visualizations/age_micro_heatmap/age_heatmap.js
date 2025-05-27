if (window.frameElement){
  document.getElementsByClassName("title")[0].remove();}



var array_data = [];

var margin = { top: 50, right: 0, bottom: 100, left: 300 },
          width = 1600 - margin.left - margin.right,        // The width of all grid areas, that is, the width of the Heatmap
          height =1000 - margin.top - margin.bottom,
          gridSize = 50,    
          legendElementWidth = 70 ,    // length of bottom bar
          buckets = 9,        // 9 colors in total
          colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], 
          tests = ["15-24","25-34","35-44","45-54","55-64","65-74","75-84"];
          
let svg = d3.select("#age")
	.append("svg") // Select "chart" (that is, div), add an svg, and set the attribute to be as large as the div
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")    // Add a g (group group) to the svg and set the display position of the element g
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(dataset).then(function (data){
	var colorScale = d3.scaleQuantile()        // Taking the value by quantile, the number of elements in each area can be equal
      .domain([2400, 125000])  // domain([min,max])
      .range(colors); 
  
  var dayLabels = svg.selectAll(".nameLabel")
      .data(data)
      .enter()    
      .append("text")   
      .text(function (d, i) { return data[i].bacteria; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * gridSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
     
  var timeLabels = svg.selectAll(".testLabel")
      .data(tests)
      .enter().append("text")
      .attr("class", "mono")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i * gridSize; })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")             
   // Draw a grid, and do not color it for now, color[0]
   for (var i = 0; i < 13; i++){
    array_data[i*7] = data[i].A;
    array_data[i*7+1] = data[i].B;
    array_data[i*7+2] = data[i].C;
    array_data[i*7+3] = data[i].D;
    array_data[i*7+4] = data[i].E;
    array_data[i*7+5] = data[i].F;
    array_data[i*7+6] = data[i].G;
    }
              
  var heatMap = svg.selectAll(".score")
      .data(array_data)
      .enter()       
      .append("rect")
      .attr("x", function(d, i){ return (i % 7)*gridSize;})
      .attr("y", function(d, i){ return parseInt(i / 7)*gridSize;})
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("class", "hour bordered")
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style("fill", "#FFFFFF");
                
     //Color the grid in 1 second
  heatMap.transition().duration(1000)
      .style("fill", function(d) { return colorScale(d); });

	heatMap.on("click",function(event,d){
		alert('average expression:'+d);
	})

                  
  var legend = svg.selectAll(".legend")
      .data([2400].concat(colorScale.quantiles()), function(d) { return d; })
      .enter().append("g")
      .attr("class", "legend");
  
  legend.append("rect")
    .attr("x", 400)
    .attr("y", function(d, i) { return gridSize * i; })
    .attr("width", gridSize / 3)
    .attr("height", gridSize)
    .style("fill", function(d, i) { return colors[i]; });
  
  legend.append("text")
    .text(function(d) { return ">="+Math.round(d); })
    .attr("x", 410+gridSize/3)
    .attr("y", function(d, i) { return 30+gridSize * i; });  
});
