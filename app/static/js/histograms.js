
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// Session Storage Handling //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (window.frameElement){
document.getElementsByClassName("title")[0].remove();
// set visibility to hidden and  set maxheight to zero
d3.select("#resetSelection").style("visibility","hidden");
d3.select("#resetSelection").style("max-height", 0);

}

// returns unique values of array, equivalent to numpy.unique()
function unique(arr) {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
}

// sets the storage['indices'] to the given parameter
function setSessionStorage(selectedIndices) {
  sessionStorage.setItem("indices", JSON.stringify(unique(selectedIndices)));
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// Constants ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get container's computed size
const container = document.getElementsByClassName('hist')[0];
const isMobile = window.innerWidth <= 768;
const containerWidth = isMobile ? 
                        container.clientWidth * 0.9:
                        container.clientWidth * 0.5;

// Set margins relative to the container's width
const margin = {
  top: containerWidth / 30,
  right: containerWidth / 30,
  bottom: containerWidth / 5,
  left: containerWidth / 7
};
const svgWidth = containerWidth - margin.left - margin.right;
const svgHeight = containerWidth/1.5 - margin.top - margin.bottom;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// Defining Histograms ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Read in Data

d3.csv(dataset).then(function(initial_data) {
  
  let svg;
  let svg2;
  let svg3;
  let svg4;

  // Defining Function for redrawing Histograms after data is resetted
  drawEverything();

  function drawEverything(){
    
    // get the indeces selected at clustering.html
    let indices = [];
    let data = [];
    if (sessionStorage.getItem('indices') !== null ){
      indices = JSON.parse(sessionStorage.getItem('indices'));
      initial_data.forEach(function (d, i) { indices.includes(i) ? data.push(d) : null });
    } else {
      data = initial_data.slice();
    }

    // nest data by region
    let nest = d3.group(data, d => d.Nationality);
      
    let list = {};
    Array.from(nest.values()).forEach(function(d, i) { list[i] = d.length; });

    // Create Matrix of cummulated values and keys
    let matrix = [];

    matrix[0] = Array.from(nest.keys());
    matrix[1] = Object.values(list);
    matrix = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    
    // append the svg object to the body of the page
    svg = d3.select("#histo1")
      .append("svg")
      .attr("width", svgWidth + margin.left + margin.right)
      .attr("height", svgHeight + margin.top + margin.bottom)
      .attr("class", "histo")
      .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");


    // X axis
    var x = d3.scaleBand()
      .range([ 0, svgWidth ])
      .domain(data.map(function(d) { return d.Nationality; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + svgHeight  + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([d3.max(Object.values(list)), 0])
      .range([0, svgHeight]);
    
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // Add Bars

    svg.selectAll("rect")
      .data(matrix)
      .enter()
      .append("rect")
      .attr("x", function(d){
              return x(d[0]);})
      .attr("y", function(d){
              return  y(d[1]);})
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
              return svgHeight - y(d[1]);})

    svg2 = d3.select("#histo2")
      .append("svg")
      .attr("width",  svgWidth + margin.left + margin.right)
      .attr("height", svgHeight + margin.top + margin.bottom)
      .attr("class", "histo")
      .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");
                  
                  
    // nest data by region
    let nest2 = d3.group(data, d => d.Sex)
                        
    let list2 = {}
    Array.from(nest2.values()).forEach(function(d, i) { list2[i] = d.length; });
                  
    // Create Matrix of cummulated values and keys
    let matrix2 = [];
                  
    matrix2[0] = Array.from(nest2.keys());
    matrix2[1] = Object.values(list2);
    matrix2 = matrix2[0].map((_, colIndex) => matrix2.map(row => row[colIndex]));
                  
                  
    // X axis
    var x = d3.scaleBand()
      .range([ 0, svgWidth ])
      .domain(data.map(function(d) { return d.Sex; }))
      .padding(0.2);
    svg2.append("g")
      .attr("transform", "translate(0," + svgHeight  + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
                  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([d3.max(Object.values(list2)), 0])
      .range([0, svgHeight]);
                      
    svg2.append("g")
      .call(d3.axisLeft(y));
                    
    // Add Bars                  
    svg2.selectAll("rect")
      .data(matrix2)                
      .enter()
      .append("rect")
      .attr("x", function(d){
                return x(d[0]);})
      .attr("y", function(d){
                return  y(d[1]);})
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
                return svgHeight - y(d[1]);})
                    
    svg3 = d3.select("#histo3")
      .append("svg")
      .attr("width",  svgWidth + margin.left + margin.right)
      .attr("height", svgHeight + margin.top + margin.bottom)
      .attr("class", "histo")
      .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");                       
    
    // nest data by region
    let nest3 = d3.group(data, d => d.BMI_group)
      
    let list3 = {}
    Array.from(nest3.values()).forEach(function(d, i) { list3[i] = d.length; });

    // Create Matrix of cummulated values and keys
    let matrix3 = [];

    matrix3[0] = Array.from(nest3.keys());
    matrix3[1] = Object.values(list3);
    matrix3 = matrix3[0].map((_, colIndex) => matrix3.map(row => row[colIndex]));

    // X axis
    var x = d3.scaleBand()
      .range([ 0, svgWidth ])
      .domain(data.map(function(d) { return d.BMI_group; }))
      .padding(0.2);
    svg3.append("g")
      .attr("transform", "translate(0," + svgHeight  + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([d3.max(Object.values(list3)), 0])
      .range([0, svgHeight]);

    svg3.append("g")
      .call(d3.axisLeft(y));

    // Add Bars
    svg3.selectAll("rect")
      .data(matrix3)                
      .enter()
      .append("rect")
      .attr("x", function(d){
                return x(d[0]);})
      .attr("y", function(d){
                return  y(d[1]);})
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
                return svgHeight - y(d[1]);})   

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////// Source: Histogram from the Tutorial ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // append the svg object to the body of the page
  svg4 = d3.select("#histo4")
    .append("svg")
    .attr("width", svgWidth + margin.left + margin.right)
    .attr("height", svgHeight + margin.top + margin.bottom)
    .attr("class", "histo")
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");


      // define meta data for x-axis
      let param = "Age";
      
      // define x and y scales
      let minValX = d3.min(data,function (subdata) { return subdata[param];});
      let maxValX = d3.max(data,function (subdata) { return subdata[param];});
      let scaleX = d3.scaleLinear()
          .domain([minValX, maxValX])
          .range([0,svgWidth]);

      // set the parameters for the histogram
      let binFunction = d3.bin()
        .value(function(test) { return test[param]; })
        .domain(scaleX.domain())  
        .thresholds(scaleX.ticks(17)); // numbers of bins
      
      // give data to function to get bins
      let bins = binFunction(data);

      let maxValY = d3.max(bins, function(x, y, z) {
          return x.length; });
      let scaleY = d3.scaleLinear()
          .domain([0, maxValY])    
          .range([svgHeight, 0]);
    
      // add x-axis
      svg4.append("g")
          .attr("transform", "translate(0," + svgHeight + ")")
          .call(d3.axisBottom(scaleX));

      // add y-axis        
      svg4.append("g")
          .call(d3.axisLeft(scaleY));
    

      // add bars 
      svg4.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")             
          .attr("transform", function(d) { 
            return "translate(" + scaleX(d.x0) + "," + scaleY(d.length) + ")"; })  
          .attr("width", function(d) { return scaleX(d.x1) - scaleX(d.x0) ; })                                                              
          .attr("height", function(d) { return svgHeight - scaleY(d.length); })   
          .attr("class","rectStyle");
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////// RESET BUTTON /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  // Reset Button for Sample Selection
  // Delete all Histograms and draw them again with updated data
  d3.select("#resetSelection")
    .on("click", function (event) {
      sessionStorage.removeItem("indices");
      d3.selectAll(".histo").remove();
      drawEverything();
    });

  // Update Button for Sample Selection
  // Updates all Histograms and draw them again with updated data
  d3.select("#updateSelection")
    .on("click", function (event) {
      d3.selectAll(".histo").remove();
      drawEverything();
    });

} 
);

