/*  * 
 * Group Project Hierarchical Tree Visualization of intestinal gut bacteria taxonomy and species.
 * @author: Dexter Frueh
 */

const svgWidth = 1200 ;
const svgHeight = 2400;
const margin = {top: 20, right: 300, bottom: 300, left: 300};

var text;
var dataframe = []
var coldat = []

var data

// Load Data
let svg = d3.select("#treePlot")
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
console.log(group)
const tree = d3.tree();
const root= d3.hierarchy(group)
console.log(root)
console.log(root.children)
function collapse(d) {
        if (d.children) {d.children.forEach(collapse)}
	else{
				d.parent.children_ =d.parent.children
		console.log(d.parent.children)
				d.parent.children = null;
	}
}
collapse(root)
console.log(root)
tree.size([2400,1200])
tree(root);

console.log(root.descendants())

// Add the links between nodes:
  svg.selectAll('path')
    .data( root.descendants().slice(1))
    .enter()
    .append('path')
    .attr("d", function(d) {
        return "M" + d.y + "," + d.x
                + "C" + (d.parent.y + 50) + "," + d.x
                + " " + (d.parent.y + 150) + "," + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + d.parent.y + "," + d.parent.x;
              })
    .style("fill", 'none')
    .attr("stroke", 'black')


 // Add  for each node.

const node = svg.selectAll("g")
      .data(root.descendants().slice(0,342))
      .enter()
      .append("g")
      .attr("transform", function(d) {
          return "translate(" + d.y + "," + d.x + ")"
      })
node.append("circle")
      	.attr("r", 2.5)
node.append("text")
      	.attr("y", d => d.children ?-6 : 5)
      	.attr("x", d => d.children ? -6 : 6)
 	.style("text-anchor", d => d.children ? "end" : "start")
  	.style("font-size", "8pt")
        .style("stroke-width", 1)
	.style("stroke", 'black')
        .text(function(d) {return d.data[0]})

///////////////////////////////
// end of csv fileimport scope
});
