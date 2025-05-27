/*  * 
 * Group Project Hierarchical Tree Visualization of intestinal gut bacteria taxonomy and species
 * @author: Dexter Frueh
 */

const svgWidth = 2000 ;
const svgHeight = 1080;
const margin = {top: 20, right: 300, bottom: 300, left: 300};

var text;
var dataframe = []
var coldat = []

var data

// Load Data
let svg = d3.select("#sunBurst")
  .append("svg")
  .attr("width", svgWidth + margin.left + margin.right)
  .attr("height", svgHeight + margin.top + margin.bottom)
  .attr("class", "chart")
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

d3.csv(dataset).then(function(data){

// start Visualization
data = data.splice(1)

group = d3.group(data, d => d.phylum, d => d.class, d => d.order, d => d.family, d => d.genus, d => d.species)
const root= d3.hierarchy(group)

/////data wrangling ..
function collapse(d) {
        if (d.children) {d.children.forEach(collapse)}
	else{
		d.parent.children_ =d.parent.children
		d.parent.children = null;
		//d.value = 1;
	}
}
collapse(root)
/////
//root.sum(function(d) {
//  return d.value;
//});
root.count();

const partition = d3.partition();
const plotheight = 1200
const plotwidth = 1400
partition.size([plotwidth,plotheight])
partition(root);
console.log(root.descendants())

// set colors
color = d3.scaleSequential([0, root.children.length - 1], d3.interpolateRainbow);
root.children.forEach((child, i) => child.index = i);

function recursiveaddnames(d, txt){
	if (d.parent != null) {return txt + recursiveaddnames(d.parent, d.data[0] + " :: ")}
	else{return txt}}
	
function getparentnames(d){
	return recursiveaddnames(d, 'taxo: ')
}
const showTooltip = function(event, d) {
	console.log(d)
    tooltip
      //style("left", plotwidth+200   + "px")
      //.style("top", 80+ "px")
      .style("visibility", 'visible')
	.text(getparentnames(d))	
      .attr('transform', 'translate(' + [plotwidth+100, 80] + ')')
	//.attr("transform",function(){
//		if (d.x1-d.x0<150) {return 'rotate(-90) translate(' + [d.x0, d.y0+10]+')' }
//		else {return 'translate('+[d.x0, d.y0 + 20] +')'}} )
      //.text(d.data[0])
.style("stroke", "black");
  }


/// add partition plot
const node = svg.selectAll('g')
  .data(root.descendants())
  .join("g")
  .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'})

node
  .append('rect')
  //.attr('x', function(d) { return d.x0; })
  //.attr('y', function(d) { return d.y0; })
  .attr('width', function(d) { return d.x1 - d.x0; })
  .attr('height', function(d) { return d.y1 - d.y0; })
  .attr('fill-opacity', 0.7 )
  .attr('fill', d => color(d.ancestors().reverse()[1]?.index))
 .on("mouseover", function(event, d){d3.select(this).style('fill-opacity', 0.9);d3.select(this).style("stroke",  "green"); showTooltip(event, d )})
 .on("mouseleave", function(d){d3.select(this).style("stroke", "darkblue"); d3.select(this).style('fill-opacity', 0.7)})

node.append('text')
	.attr("transform", function(d){
		if (d.x1-d.x0<150) {return 'rotate(-90) translate(0,10)' }
		else {return 'translate(00,20 )'}} )
	.style("text-anchor", function(d){if (d.x1-d.x0<150){return "end"}else {return "start"}})
        .text(function(d) {return d.data[0]})
  	.style("font-size", "6pt")
	//.style("stroke", 'darkblue')

const tooltip = svg
    .append("text")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("padding", "5px")
    .style("stroke", "lightgray")
//////////////////////////////
// end of csv fileimport scope
});
