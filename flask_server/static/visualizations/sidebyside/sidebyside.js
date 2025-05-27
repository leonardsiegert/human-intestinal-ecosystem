// JS code for the side by side solution site
// reload all IFrames
document.querySelectorAll("iframe").forEach(function(e){ e.src+=""; });

var elem = document.getElementsByClassName("rowwrap")[0]; //div#container
var elemWidth = elem.scrollWidth;
var elemVisibleWidth = elem.offsetWidth;
elem.scrollLeft = (elemWidth - elemVisibleWidth) / 2;



// adjust size of Iframe content
leftvis.onload = function() {
//leftvis.window.document.getElementById("ButtonSB").attr("class", 'clicked')
leftvis.window.d3.select("#sunBurst").style("transform", "scale(1)") // this was the hidden bug. neccessary for some reason 
}

d3.select("#resetSelection")
        .style("visibility", "visible")
        .on("click", function(event){
            rightvis.window.document.getElementById("resetSelection").click()
            leftvis.window.document.getElementById("updateData").click()
            middlevis.window.document.getElementById("updateSelection").click()
			//d3.select(this).style("opacity",0.3)
            //leftvis2.window.document.getElementById("search").click()
			})

d3.select("#updatePCA")
        .on("click", function(event){
            leftvis2.window.document.getElementById("search").click()})

d3.select("#updateData")
        .on("click", function(event){
            middlevis.window.document.getElementById("updateSelection").click()
            leftvis.window.document.getElementById("updateData").click()
            //leftvis2.window.document.getElementById("search").click()
			//leftvis.window.d3.select("#sunBurst").style("transform", "scale(0.5)")
			//leftvis.window.d3.select("#sunBurst").style("transform", "scale(1.2)")
			//d3.select("#resetSelection").style("opacity", 1)
            });

