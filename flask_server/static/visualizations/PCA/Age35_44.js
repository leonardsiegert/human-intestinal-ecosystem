/***
 * @author Yini Miao
 * @author for interactivity: Dexter Früh
 * The PCA of Age35_44
 ***/
if (window.frameElement){
document.getElementsByClassName("title")[0].remove();}

var margin = {top: 45, right: 20, bottom: 40, left: 80},
    width = 760 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;


var svg = d3.select("#Age35_44")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

svg.append("text")
    .attr("transform", "translate(" + (width/2) + "," + (-20) + ")")
    .style("text-anchor", "middle")
    .text("Bubble chart of male PCA loadings");

d3.csv(dataset).then(function(data) {
     // x-axis
  var x = d3.scalePoint()
    .domain(['','PC1','PC2','PC3','PC4','PC5'])
    .range([ 0, width-100 ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // X axis label:
  svg.append("text")
    .attr("transform", "translate(" + (width/2) + "," + (height + 31) + ")")
    .style("text-anchor", "middle")

  // Y axis
  var y = d3.scaleLinear()
    .domain([0, 130])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Y axis label:
  svg.append("text")
    .attr("transform", "translate(" + (0) + "," + (-10) + ")")
    .style("text-anchor", "middle")
    .text("bacteria_id");

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([0, 30000])
    .range([ 0, 10]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["positive", "negative"])
    .range(d3.schemeSet2);

  
    // Create a tooltip:
  var tooltip = d3.select("#Age35_44")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "pink")
    .style("border-radius", "1px")
    .style("padding", "5px")
    .style("color", "black")

    // Add dots
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .each(function(d){d.circle = this;})
      .attr("class", function(d) { return "bubbles bubbles" + d.sign })//+ d.PC ;)
      .attr("cx", function (d) { return x(d.PC); } )
      .attr("cy", function (d) { return y(d.bacteria_id); } )
      .attr("r", function (d) { return z(d.loading); } )
      .attr("fill", function (d) { return myColor(d.sign); } )
      .style("opacity",0.7)
    // show country when mouseover.
    .on("mouseover", function(event, d){
      tooltip.transition()
             .duration(200)
             .style("opacity", 1);
      tooltip.html("PC: " + d.PC + "<br> Bacteria: " + d.bacteria_name + "<br> Loading: " + d.loading)
            .style("left", (event.pageX)+'px')
            .style("top", (event.pageY - 28)+'px'); 
    })
    .on("mouseout", function(d){
      tooltip.transition(500)
      .style("opacity", 0);
    })
    .on("click", function(event, d){
      alert("PC: " + d.PC + "\nBacteria id: " + d.bacteria_name + "\nLoading: " + d.loading)
    });



  var highlight = function(event,d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .1)
    // expect the one that is hovered
    d3.selectAll(".bubbles"+d).style("opacity", 0.7)
  }
  var noHighlight = function(event,d){
    d3.selectAll(".bubbles").style("opacity", 0.7)
  }

  // name the different colors of boubbles: signs
  var size = 20
  var allgroups = ["positive","negative"]
  svg.selectAll("myrect")
    .data(allgroups)
    .enter()
    .append("circle")
      .attr("cx", width-80)
      .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function(d){ return myColor(d)})
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)

  
  svg.selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
      .attr("x", width-70)
      .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return myColor(d)})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)


// Search bar

  const searchInput = document.querySelector('.input')

  function setList(data){
    for (const bacteria of data){
    const resultItem = document.createElement('li')
    resultItem.classList.add('result-item')
    const text = document.createTextNode(bacteria.bacteria_name+":"+bacteria.PC+":"+bacteria.loading)
    resultItem.appendChild(text)
    list.appendChild(resultItem)
  }
    if(data.length == 0){
      noResults()
    }
  }
  searchInput.addEventListener("input", (e) => {
    let value = e.target.value

    if (value && value.trim().length > 0){
         
        //returning only the results of setList if the value of the search is included in the person's name
        setList(data.filter(bacteria => {
            return bacteria.bacteria_name.includes(value)
        }))
    }
  })
  const clearButton = document.getElementById('clear')
  function clearList(){
    // looping through each child of the search results list and remove each child
    while (list.firstChild){
        list.removeChild(list.firstChild)
    }
  }
  searchInput.addEventListener("input", (e) => {
    let value = e.target.value

    if (value && value.trim().length == 0){
        clearList()

    }
  })
  clearButton.addEventListener("click", () => {
    clearList()
   })

  function noResults(){
    // create an element for the error; a list item ("li")
    const error = document.createElement('li')
    // adding a class name of "error-message" to our error element
    error.classList.add('error-message')

    // creating text for our element
    const text = document.createTextNode('No results found!')
    // appending the text to our element
    error.appendChild(text)
    // appending the error to our list element
    list.appendChild(error)
  }

  searchInput.addEventListener("click",  (e) => {getSessionStorage()})
  function getSessionStorage(){
      let mySession = JSON.parse(sessionStorage.getItem("bact"));
      make_tooltip(mySession)
      //return mySession
  }

  function make_tooltip(bact_name){
    let bact
    for (bacteria of data){
      if (bacteria.bacteria_name  === bact_name){
          if (bacteria.PC === "PC1"){
              bact = bacteria 
          } 
      d3.select(bacteria.circle).attr("fill", "red").transition().duration(2000).attr("fill", myColor(bacteria.sign))
      
      }}
      tooltip.transition()
             .duration(2000)
             .style("opacity", 1);
      tooltip.html("PC: " + bact.PC + "<br> Bacteria: " + bact.bacteria_name + "<br> Loading: " + bact.loading)
      d3.select(bact.circle).attr("fill", "red")

    }
    })
