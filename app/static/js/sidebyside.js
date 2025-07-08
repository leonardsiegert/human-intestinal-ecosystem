d3.select("#resetSelection")
    .style("visibility", "visible")
    .on("click", function (event) {
        rightvis.window.document.getElementById("resetSelection").click()
        leftvis.window.document.getElementById("updateData").click()
        middlevis.window.document.getElementById("updateSelection").click()
    })

d3.select("#updateData")
    .on("click", function (event) {
        middlevis.window.document.getElementById("updateSelection").click()
        leftvis.window.document.getElementById("updateData").click()
    });
