/**
 * Remove the title element if the script is running inside an iframe.
 */
if (window.frameElement) {
	document.getElementsByClassName("title")[0].remove();
	d3.select("#updateData").style('visibility', "hidden");
	d3.select("#resetSelection").style("max-height", 0);
	// add a link to the h2.subtitle
	d3.select("h2.subtitle")
		.on("click", () => {
			window.top.location.href = "/sunburst";
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

/**
 * Measure the pixel width of a given text string using a specified font.
 * @param {string} text - The text to measure.
 * @param {string} font - The font style to use.
 * @returns {number} The width of the text in pixels.
 */
function measureTextLength(text, font) {
	const canvas = measureTextLength.canvas || (measureTextLength.canvas = document.createElement("canvas"));
	const context = canvas.getContext("2d");
	context.font = font;
	const metrics = context.measureText(text);
	return metrics.width;
}

/**
 * Get the computed CSS style property value for a given element.
 * @param {Element} element - The DOM element.
 * @param {string} prop - The CSS property name.
 * @returns {string} The computed style value.
 */
function getCssStyle(element, prop) {
	return window.getComputedStyle(element, null).getPropertyValue(prop);
}

/**
 * Construct a CSS font string from an element's computed styles.
 * @param {Element} [el=document.body] - The DOM element.
 * @returns {string} The CSS font string.
 */
function getCanvasFontSize(el = document.body) {
	const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
	const fontSize = getCssStyle(el, 'font-size') || '16px';
	const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
	return `${fontWeight} ${fontSize} ${fontFamily}`;
}


const container = document.getElementById("sunBurst");
const svgWidth = container.clientWidth * 0.75;
const svgHeight = svgWidth;
const radius = svgWidth / 2 - 20;
// const isMobile = window.innerWidth <= 768;
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
		top: svgWidth / 4,
		bottom: svgWidth / 6,
		left: svgWidth / 5,
		right: svgWidth / 4
	} : {
		top: svgWidth / 10,
		right: svgWidth / 7,
		bottom: svgWidth / 4,
		left: svgWidth / 10
	};

const fontSizeCompl = isMobile ? "3pt" : "8pt";
const strokeWidthCompl = isMobile ? 0.3 : 1;

var text;
var dataframe = []
var coldat = []
var data
var root
var node
var values
var values_total
var values_rel
var first_calc = 1;
var infobox = 1
var hl = 0
// Load Data
var basesvg = d3.select("#sunBurst")
	.append("svg")
	.attr("width", svgWidth + margin.left + margin.right)
	.attr("height", svgHeight + margin.top + margin.bottom)

function getIndices() {
	return sessionStorage.getItem("indices");
}

/**
 * Calculate the abundance of each bacteria species across all samples.
 * Updates the global `values` array with normalized abundances.
 * @param {Array} data_sample - The sample data array.
 */
function calc_bacteria_abundance(data_sample) {
	values = []
	for (ele in data_sample[0]) {
		values[ele] = 0
	}
	let i = 0;
	sum = 0
	for (bacteria_species in data_sample[0]) {
		if (i > 6) {
			for (sample of data_sample) {
				values[bacteria_species] += parseFloat(sample[bacteria_species]);
				sum += parseFloat(sample[bacteria_species])
			};
		}
		i = i + 1;
	}
	i = 0;
	for (bacteria_species in data_sample[0]) {
		values[bacteria_species] = values[bacteria_species] / sum
	}
	console.log("values: ")
	console.log(values)
}

d3.csv(dataset_samples).then(function (data_samplees) {
	d3.csv(dataset_taxonomy).then(function (data_taxonomy) {
		data_taxonomy = data_taxonomy.splice(1)

		/**
		 * Remove the sunburst SVG and tooltip from the DOM.
		 */
		function remove_sunb() {
			basesvg.selectAll("*").remove()
			tooltip.remove()
		}

		/**
		 * Create hierarchical data structure for the sunburst plot based on selected indices.
		 * @param {Array} indices - Indices of selected samples.
		 * @returns {Array} values - Calculated abundance values.
		 */
		function create_data(indices) {
			data_selection_taxo = []
			data_selection = []
			console.log(prop + " prop")

			if ((indices.length == 0)) {
				data_selection_taxo = data_taxonomy
				data_selection = data_samplees
			} else {
				data_selection_taxo = data_taxonomy
				for (ind of indices) {
					data_selection.push(data_samplees[ind])
				}
			}
			group = d3.group(data_selection_taxo, d => d.phylum, d => d.class, d => d.order, d => d.family, d => d.genus, d => d.species)
			root = d3.hierarchy(group)

			// Data wrangling
			collapse(root)
			calc_bacteria_abundance(data_selection)
			if (first_calc) {
				values_total = []
				for (b in values) { values_total[b] = values[b] }
			}
			values_rel = []
			for (b in values) { values_rel[b] = values[b] / values_total[b] }


			giveChildValue(root)
			first_calc = 0
			return values

			/* somehow one layer in the data_taxonomy taxonomy was too much/the last level duplicated. So this function essentially makes the node before the leaves to the new leaves*/
			/**
			 * Collapse the hierarchy so that the node before the leaves becomes the new leaf.
			 * @param {Object} d - The current node in the hierarchy.
			 */
			function collapse(d) {
				if (d.children) { d.children.forEach(collapse) }
				else {
					d.parent.data.value = 1
					d.parent.children_ = d.parent.children
					d.parent.children = null;
				}
			}

		}
		/**
		 * Recursively assign calculated values to each node in the hierarchy.
		 * @param {Object} d - The current node in the hierarchy.
		 */
		function giveChildValue(d) {
			if (d.children) {
				d.children.forEach(giveChildValue)
				d.data.val_total = d.sum(d => d.value_total).value;
				d.data.val = d.sum(d => d.value_).value
				d.data.val_rel = d.data.val / d.data.val_total
			}
			else {
				d.data.value_total = values_total[d.data[0]]
				d.data.val_total = values_total[d.data[0]];
				d.data.value_rel = values_rel[d.data[0]]
				d.data.val_rel = values_rel[d.data[0]]
				d.data.value_ = values[d.data[0]]
				d.data.val = values[d.data[0]]

				if (relativeData) {
					d.data.value = values_rel[d.data[0]]
				}
				else {
					d.data.value = values[d.data[0]]
				}
			}
		}

		/**
		 * Prepare the sunburst data for the current mode (abundance or categorical).
		 * @param {number} prop_bool - 0 for categorical, 1 for abundance.
		 */
		function create_sunb_data(prop_bool) {
			if (prop_bool == 0) {
				root.sum(function (d) {
					return d.value;
				});
			}
			else {
				root.count();
			}

			const partition = d3.partition();
			const degrees = 2 * Math.PI
			partition.size([degrees, radius]);

			partition(root);

			TOLColors = ['#77AADD', '#EE8866', '#EEDD88', '#FFAABB', '#99DDFF', '#44BB99', '#BBCC33', '#AAAA00', '#DDDDDD']
			//Colorblind options
			switch (prop_bool) {
				case 1:
					switch (relativeData) {
						case 1:
							color = d3.scaleSequential([0, Math.sqrt(4)], d3.interpolateBrBG); // d3.interpolatePuBuGn) ; //d3.scaleSequential([0, Math.sqrt(root.data.val_rel)], d3.interpolateGreens); // d3.interpolatePuBuGn) ;		color =  123
							break;
						case 0:
							color = d3.scaleSequential([0, Math.sqrt(root.data.val)], d3.interpolateGreens); // d3.interpolatePuBuGn) ;		//color =  123
							break;
					}
					break;
				case 0:
					switch (relativeData) {
						case 1:
							color = d3.scaleOrdinal([0, root.children.length], d3.schemeTableau10)// TOLColors
							break;
						case 0:
							color = d3.scaleOrdinal([0, root.children.length], d3.schemeTableau10)// TOLColors
							break;
					}
					break;
			}
			root.children.forEach((child, i) => child.index = i);
		}
		// create a tooltip function(s)
		function recursiveaddnames(d, txt) {
			if (d.parent != null) {
				return recursiveaddnames(d.parent, " :: " + d.data[0]) + txt
			}
			else { return txt }
		}

		function getparentnames(d) {
			return "Taxonomy: " + recursiveaddnames(d, '')
		}
		//width = document.getElementById("tooltip").offsetWidth


		TTx_offset = -40
		TTy_offset = 60
		/**
		 * Show the tooltip for a sunburst segment.
		 * @param {Event} event - The mouse event.
		 * @param {Object} d - The data node.
		 */
		function showTooltip(event, d) {
			TTy_offset_var = TTy_offset;
			let ttopacity = 1;
			let ttcolor = "black";
			let visibility = "visible"
			if (d.parent) { tooltiptext = d.data[0]; }
			else { ttcolor = ' black', ttopacity = .8; tooltiptext = (!prop ? "switch to categorical view" : "switch to abundance view"); }
			tooltiptextwidth = measureTextLength(tooltiptext, getCanvasFontSize(document.getElementById("tooltiptext")))
			tooltiptextwidth_large = 250
			if (svgWidth - event.x < tooltiptextwidth_large) {
				TTx_offset_var = tooltiptextwidth
			}
			else { TTx_offset_var = document.getElementById("sunBurst").offsetLeft - TTx_offset - 40; }
			text_anchor = "left"
			tooltip
				.style("visibility", visibility)
				.style("position", "fixed")
				.style("width", tooltiptextwidth + "px")
				.html("<strong>" + tooltiptext + "</strong>")//+ " "+ d.data.val.toExponential(3))
				.style("text-align", text_anchor)
				.style("left", (event.x) - TTx_offset_var + "px")
				.style("top", (event.y) - TTy_offset_var + "px")
				.style("background-color", ttcolor)
				.style("opacity", ttopacity)
			//.style("color", "red")
		}
		/**
		 * Show detailed information in the tooltip when a segment is clicked.
		 * @param {Event} event - The mouse event.
		 * @param {Object} d - The data node.
		 */
		function clickTooltip(event, d) {
			let val = d.data.val
			let totval = d.data.val_total
			let relval = d.data.val_rel
			console.log(val, totval, relval, d)
			tooltip
				//.style("width", tooltiptextwidth_large)
				.html('<strong> ' + d.data[0] +
					'</strong> <br>' + parseFloat((val * 100).toFixed(1 - Math.floor(Math.log(val) / Math.log(10)))) + "% of total bacteria abundance" +
					'<br>' + parseFloat((relval * 100).toFixed(1 - Math.floor(Math.log(relval) / Math.log(10)))) + "% compared to average abundance " +
					'<br>'
					+ '<br> ' + getparentnames(d)
				)
				.style("visibility", 'visible')
				// suggest some transition effects
				.style("transition", "all 2s ease-in-out")
				.style("transition-delay", "0s")
				.style("left", (event.x) - TTx_offset_var + "px")
				.style("top", (event.y) - TTy_offset_var + "px")
		}

		const moveTooltip = function (event, d) {
			tooltip
				.style("left", (event.x) - TTx_offset_var + "px")
				.style("top", (event.y) - TTy_offset_var + "px")
		}
		const hideTooltip = function (event, d) {
			tooltip
				.style("visibility", 'hidden')
		}

		/**
		 * Draw the sunburst plot using the current hierarchical data and mode.
		 * @param {number} prop_bool - 0 for categorical, 1 for abundance.
		 */
		function draw_sunb(prop_bool) {
			//create pie parts from the partition coordinates and everything belonging to that chart
			svg = basesvg.append("g")
				.attr("id", "sunburstsvg")
				.attr("transform", "translate(" + (margin.left + svgWidth / 2) + "," + (margin.top + svgHeight / 2) + ")");

			const pie = d3.arc()
				.startAngle(d => d.x0)
				.endAngle(d => d.x1)
				.innerRadius(d => d.y0)
				.outerRadius(d => d.y1)
				.padAngle(4)
				.padRadius(2)


			/// add partition plot
			node = svg.selectAll('g')
				.data(root.descendants())

			function applyparents(d, select, val) {
				if (d.parent.parent) {
					applyparents(d.parent, select, val);
				}
				if (d.parent) {
					d3.select(d.pie).style(select, val);
				}
			}

			function switch_mode() {
				prop ? d3.select("#ButtonSB").attr("class", "clicked") : d3.select("#ButtonSB").attr("class", 'clicked')
				prop = Number(!prop)
				console.log("new prop: " + prop)
				update_page(prop)
			}

			const fillcolor = function (d) {
				switch (prop_bool) {
					case 0:
						switch (relativeData) {
							case 1:
								return (d.children ? "lightgray" : color((d.ancestors().reverse()[1]?.index)))// color[((d.ancestors().reverse()[1]?.index))])

								break;
							case 0:
								return color(d.ancestors().reverse()[1]?.index);//color[(d.ancestors().reverse()[1]?.index)]/
								break;
						}
						break;
					case 1:
						switch (relativeData) {
							case 1:
								return (d.parent ? color(d.data.val_rel) : 1);
								break;
							case 0:
								return (d.parent ? color(Math.sqrt(d.data.val)) : 1);
								break;
						}
						break;
				}
			}

			node
				.join("path")
				.each(function (d) { d.pie = this; })
				.attr('d', pie)
				.attr('fill', d => fillcolor(d))
				.style("cursor", d => d.parent ? "pointer" : "pointer")
				.attr('class', 'sunBurst_field')
				.on("mouseover", function (event, d) {
					if (d.parent) {
						if (hl) { applyparents(d, 'opacity', 0.65) };
						showTooltip(event, d);
						if (!d.children) { d3.select(d.label).attr("class", "textlabels--active") }
						d3.select(this).style("stroke", 'red'); d3.select(this).style("stroke-width", '1px');
						d3.select(this).style("opacity", '1');
					}
					else { showTooltip(event, { data: ["switch to proportional view"] }) }
				})
				.on("mousemove", moveTooltip)
				.on("scroll", moveTooltip)
				.on("mouseleave", function (event, d) {
					if (d.parent) {
						if (hl) { applyparents(d, 'opacity', 0.9) };
						d3.select(d.label).attr("class", "textlabels"); d3.select(this).style("stroke-width", "0.7"); d3.select(this).style("stroke", 'black'); d3.select(this).style('fill-opacity', 1);
						d3.select(this).style("opacity", '0.9');
					}; hideTooltip()
				})
				.on("click", function (event, d) {
					if (d.parent) {
						if (!d.children) {
							setSessionStorage(d.data[0]);
						}
						clickTooltip(event, d)
					}
					else {
						hideTooltip();
						switch_mode()
					}
				})
				.text(function (d) { if (d.parent) { return d.data[0] } })

			// Add text labels to the sunburst plot pie pieces


			complNode = node.enter().append("text")
				.attr("pointer-events", d => (d.children ? "none" : "auto"))
				.attr("cursor", d => (d.children ? "none" : "pointer"))
				.attr("class", "textlabels")
				//	.style("font-size", d => (1/Math.sqrt(measureTextLength(d.data[0], getCanvasFontSize(document.getElementsByClassName("textlabels")[0])))* 20 +"px"))
				.style("font-size", fontSizeCompl)
				.style("stroke", 'black')
				.style("stroke-width", strokeWidthCompl)
				.each(function (d) { d.label = this; })
				.attr("transform",
					function (d) {
						if (((d.x1 + d.x0) / 2 * 360 / (2 * Math.PI) - 90) > 90) {
							return "rotate (" + ((d.x1 + d.x0) / 2 * 360 / (2 * Math.PI) - 90) +
								") translate (" + ((d.children ? d.y0 : d.y1) + 2) + ") rotate(180)"
						}// rotate(180)"  
						else {
							return "rotate (" + ((d.x1 + d.x0) / 2 * 360 / (2 * Math.PI) - 90) +
								") translate (" + ((d.children ? d.y0 : d.y1) + 2) + ")"
						}
					})
				.style("visibility", d =>
				((d.children && measureTextLength(d.data[0], getCanvasFontSize(document.getElementsByClassName("textlabels")[0])) > 1.0 * (d.y1 - d.y0)) ||
					((d.x1 - d.x0) * d.y0 < .2 * (d.y1 - d.y0)) ? 'hidden' : "visible"))
				.text(function (d) { if (d.parent) { return d.data[0] } })
				.attr("text-anchor", d => (((d.x1 + d.x0) / 2 * 360 / (2 * Math.PI) - 90) > 90) ? "end" : "start")


			d3.select(root.pie).on("mouseover", function (event, d) { showTooltip(event, { data: ["switch to proportional view"] }) })
				.on("mouseleave", function (event, d) { })


			function setSessionStorage(bactname) {
				sessionStorage.setItem("bact", JSON.stringify(bactname));
			}

			complNode
				.on("click", function (event, d) {
					setSessionStorage(d.data[0]);
				})

			tooltip =
				d3.select("#sunBurst")
					.append("div")
					.attr("class", "tooltip")
					.attr("font", "11pt")
					.attr("id", "tooltiptext")
					.style("z-index", "10")
					.style("visibility", "hidden")

			// Add the legend for the colors
			let rectWidth = svgWidth / 20;
			let rectHeight = svgHeight / 50;
			let legendx = - ((svgWidth - margin.left - margin.right) / 2);
			let legendy = svgHeight - margin.bottom - margin.top;
			let legendwidth = svgWidth - margin.left - margin.right;


			if (!prop) {
				// Add one rectangle in the legend for each name.
				var legend = svg.selectAll(".legend")
					.data(root.children)
				let size = legendwidth / root.children.length
				legend
					.enter()
					.append("rect")
					.attr("class", "sunBurst_field")
					.attr("width", rectWidth)
					.attr("height", rectHeight)
					.attr("y", legendy)
					.attr("x", function (d, i) { return legendx + i * (size) })
					.style("fill", d => !relativeData ? color(d.index) : color(d.index))//
				// Add labels beside legend 
				legend
					.enter()
					.append("text")
					.attr("class", "categorical")
					.attr("x", (d, i) => legendx + i * size - (size / 2))
					.attr("y", legendy + svgHeight / 15)
					.attr("transform", (d, i) => "rotate(-20 " + (legendx + i * size) + " " + legendy + ")")
					.style("font-size", fontSizeCompl)
					.style("stroke-width", strokeWidthCompl)
					.style("fill", d => !relativeData ? color(d.index) : color(d.index)) //color[d.index]: color[d.index])p
					.text(d => !prop_bool ? (d.data[0]) : 200 * d.index / 10)
					.attr("text-anchor", "left")
					.style("alignment-baseline", "middle")
			}
			else {
				var hundredArray = Array.from(Array(100).keys());
				var xcolorScale = d3.scaleLinear()
					.domain([0, 99])
					.range([0, legendwidth]);

				var legendcont = svg.selectAll(".legend")
					.data(hundredArray)

				legendcont
					.enter()
					.append("rect")
					.attr("class", "continuous, sunBurst_field")
					.attr("x", (d) => legendx + Math.floor(xcolorScale(d)))
					.attr("y", legendy)
					.attr("height", rectHeight)
					.attr("width", (d) => {
						if (d == 1) {
							return 6;
						}
						return Math.floor(xcolorScale(d + 1)) - Math.floor(xcolorScale(d)) + 1;
					})
					.attr("fill", (d) => relativeData ? color((Math.sqrt(d / 100 * 4))) : color((d / 100 * 2)))


				var tenArray = Array.from(Array(3).keys());
				var legendtext = svg.selectAll(".legend")
					.data(tenArray)
				var xcolorScaletext = d3.scaleLinear()
					.domain([2, 0])
					.range([0, legendwidth]);
				legendtext
					.enter()
					.append("text")
					.attr("x", (d) => legendx + legendwidth - Math.floor(xcolorScaletext(d)))
					.attr("y", function (d, i) { return legendy + 35 })
					.style("fill", 'black')
					.text(d => relativeData ? (d / 2 * 400) + "%" : d / 2 * 100 + "%")
					.attr("text-anchor", "middle")
					.style("alignment-baseline", "middle")
			}
		}

		/**
		 * Update the sunburst plot to show relative data.
		 */
		function create_rel_data() {
			remove_sunb()
			giveChildValue(root)
			create_sunb_data(prop)
			draw_sunb(prop)
			console.log("should update!")
		}

		/**
		 * Update the sunburst plot and data based on the current mode and selection.
		 * @param {number} prop_bool - 0 for categorical, 1 for abundance.
		 */
		function update_page(prop_bool) {
			//console.log('indices:' + iconst copied = { ...original }
			indices = sessionStorage.getItem("indices") ? sessionStorage.getItem("indices") : [];
			if (typeof svg != "undefined") { remove_sunb() }
			if (indices.length > 2) {
				indices = indices.slice(1, -1)
				indices = Array.from(indices.split(','), Number)
			} else { indices = []; }
			remove_sunb()
			create_data(indices)
			//calc_bacteria_abundance(data_selection)
			create_sunb_data(prop_bool)
			draw_sunb(prop_bool)
			console.log("should update!")
		}

		var prop = 0
		var relativeData = false | 0;
		create_data([])
		create_sunb_data(prop)
		draw_sunb(prop)
		console.log("root")
		console.log(root)
		update_page(prop)

		//root = create_data([])
		//create_sunb_data(prop)
		//let svg = draw_sunb(prop)
		d3.select("#SBcheckbox").on("click", function () {
			hl = !hl
		})

		d3.select("#ButtonSB2")
			.attr("class", "unclicked")
			.on("click", function (event) {
				if (d3.select("#ButtonSB2").classed("unclicked")) {
					d3.select("#ButtonSB2")
						.attr("class", "clicked")
				}
				else {
					d3.select("#ButtonSB2")
						.attr("class", "unclicked")
				}
				relativeData = Number(!relativeData)
				create_rel_data()
			});

		d3.select("#ButtonSB")
			.attr("class", "unclicked")
			.style("visibility", "visible")
			.on("click", function (event) {
				if (d3.select("#ButtonSB").classed("unclicked")) {
					remove_sunb()
					prop = 1
					create_sunb_data(prop);
					draw_sunb(prop);
					d3.select("#ButtonSB")
						.attr("class", "clicked")

				}
				else {
					remove_sunb()
					prop = 0
					create_sunb_data(prop);
					draw_sunb(prop);
					d3.select("#ButtonSB")
						.attr("class", "unclicked")
				}

			});

		d3.select("#updateData")
			// .style("visibility", "visible")
			.on("click", function (event) {
				console.log("update Data " + prop)
				update_page(prop)
			})


		// InfoBox
		d3.select("#infoBox")
			.on("click", function () { changeInfoBox() })

		d3.select("#infoBox")
			.append("p")
			.attr("id", "infoBox1");
		d3.select("#infoBox")
			.append("p")
			.attr("id", "infoBox2");
		d3.select("#infoBox")
			.append("p")
			.attr("id", "infoBox3");


		infobox = 0
		changeInfoBox(0)
		/**
		 * Toggle the InfoBox display and update its content.
		 */
		function changeInfoBox() {
			text1 = "This plot shows the abundance (amount) of the bacteria over the selected sample, and the taxonomy of the bacteria (which family/ genus/ etc they belong to)."
			text2 = "Choose between the abundance view, where the sizes of the elements vary according to the amount of bacteria, and the taxonomy/categorical view, where the sizes are the same for each bacteria. The color respectively encodes the other variable, the category or the amount of the bacteria. "
			text3 = "Also choose between absolute or relative data view, to see absolute proporion of the bacteria, or relative according to the selection which is made. Clicking on a bacterium highlights its PCA loading in the PCA visualization below."
			if (infobox) {
				hideInfoBox()
				d3.select("#InfoButton").attr("class", 'clicked')
			}
			else {
				d3.select("#infoBox1")
					.text(text1);
				d3.select("#infoBox2")
					.text(text2);
				d3.select("#infoBox3")
					.text(text3);
				d3.select("#infoBox").style("visibility", "hidden")
				infobox = 1
				d3.select("#InfoButton").attr("class", 'unclicked')
			}
		}
		/**
		 * Show the InfoBox.
		 */
		function hideInfoBox() {
			d3.select("#infoBox").style("visibility", 'visible')
			infobox = 0
		}

		d3.select("#InfoButton").on("click", d => changeInfoBox())

		//
		//////////////////////////////
		// end of csv fileimport scope
	})
});