/**
 * SVG canvas dimensions and margins for the tree plot visualization.
 */
const container = document.getElementById("tree");
console.log(container.clientHeight, container.clientWidth);
const svgWidth = container.clientWidth;
const svgHeight = svgWidth * 2;
// const svgWidth = 1200 ;
// const svgHeight = 2400;
const margin = {
  top: svgWidth / 10,
  right: svgWidth / 7,
  bottom: svgWidth / 4,
  left: svgWidth / 50
};
// const margin = {top: 20, right: 300, bottom: 300, left: 300};

// if on mobile, change font size and such
const isMobile = window.innerWidth <= 768;

const pathsize = isMobile ? 1 : 50;
const textx = isMobile ? 2 : 6;
const texty = isMobile ? 2 : 6;
const fontsize_tree = isMobile ? "4pt" : "8pt";
const strokeWidth = isMobile ? 0.3 : 1;

var text;
var dataframe = []
var coldat = []

var data

/**
 * Create the SVG container and group element for the tree plot.
 */
let svg = d3.select("#tree")
  .append("svg")
  .attr("width", svgWidth + margin.left + margin.right)
  .attr("height", svgHeight + margin.top + margin.bottom)
  .attr("class", "chart")
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

/**
 * Load the CSV data and build the hierarchical tree visualization.
 */
d3.csv(dataset).then(function(data){
    
    // Remove the first row (header or unwanted entry)
    data = data.splice(1)

    /**
     * Group data hierarchically by taxonomic levels.
     */
    group = d3.group(data, d => d.phylum, d => d.class, d => d.order, d => d.family, d => d.genus, d => d.species)
    console.log(group)

    const tree = d3.tree();
    const root = d3.hierarchy(group)
    console.log(root)
    console.log(root.children)

    /**
     * Recursively collapse all children of a node except the root.
     * @param {Object} d - The current node in the hierarchy.
     */
    function collapse(d) {
        if (d.children) {
            d.children.forEach(collapse)
        } else {
            d.parent.children_ = d.parent.children
            console.log(d.parent.children)
            d.parent.children = null;
        }
    }
    collapse(root)
    console.log(root)

    // Set the size of the tree layout based on the SVG dimensions.
    // Adjust the size for mobile view
    tree.size(isMobile ? [svgHeight*0.9,svgWidth*0.75] : [svgHeight*0.5,svgWidth*0.85]);
    tree(root);

    console.log(root.descendants())

    /**
     * Draw the links (edges) between nodes in the tree.
     */
    svg.selectAll('path')
        .data(root.descendants().slice(1))
        .enter()
        .append('path')
        .attr("d", function(d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.parent.y + pathsize) + "," + d.x
                + " " + (d.parent.y + pathsize*3) + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
        })
        .style("fill", 'none')
        .attr("stroke", 'black')

    /**
     * Draw the nodes (circles and labels) for each taxonomic group.
     */
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
        .attr("y", d => d.children ? -texty : texty)
        .attr("x", d => d.children ? -textx : textx)
        .style("text-anchor", d => d.children ? "end" : "start")
        .style("font-size", fontsize_tree)
        .style("stroke-width", strokeWidth)
        .style("stroke", 'black')
        .text(function(d) { return d.data[0] })

    // end of csv file import scope
});
