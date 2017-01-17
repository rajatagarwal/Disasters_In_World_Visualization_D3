var width_donut_affected = 400;
var height_donut_affected = 400;
var radius_donut_affected = Math.min(width_donut_affected, height_donut_affected)/2;
var donut_thickness_affected = 75;
var legendRectSize_affected = 18;
var legendSpacing_affected = 4;

var color_donut_affected = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var svg_donut_affected = d3.select("#svg_donut_affected")
						.append("svg")
						.attr("width", width_donut_affected)
						.attr("height", height_donut_affected)
						.append("g")
						.attr("transform", "translate(" + (width_donut_affected/2) + "," + (height_donut_affected/2) + ")");
var arc_donut_affected = d3.arc()
						.innerRadius(radius_donut_affected - donut_thickness_affected)
						.outerRadius(radius_donut_affected);

var pie_affected = d3.pie()
					.value(function(d) { return d.affected_people; })
					.sort(null);

var tt_donut_affected = d3.select("#svg_donut_affected").append("div").attr("class", "tooltip");

function typeFormatter(type) {
    return type == "Extreme_temperature" ? "Extreme Temperature" : type
}

d3.csv("t2_all_year_donut_affected.csv", type, function(error, data_donut_affected) {
  if (error) throw error;
  var path_affected = svg_donut_affected.selectAll("path")
						.data(pie_affected(data_donut_affected))
						.enter()
						.append("path")
						.attr("d", arc_donut_affected)
						.attr("fill", function(d, i){
							return color_donut_affected(d.data.type);
						});
	// Get total 
  var total_affected = d3.sum(data_donut_affected, function(d){
  	return d.affected_people;
  });
  // Calculate percentage
  data_donut_affected.forEach(function(d) {
    	d.percentage = (+d.affected_people  / total_affected * 100).toFixed(2);
  });
  // Legend
  var legend_donut_affected = svg_donut_affected.selectAll('.legend')
            .data(color_donut_affected.domain())
            .enter()
            .append('g')
            .attr('class', 'legend_donut_affected')
            .attr('transform', function(d, i) {
              var height_donut_affected_legend = legendRectSize_affected + legendSpacing_affected;
              var offset_donut_affected_legend =  height_donut_affected_legend * color_donut_affected.domain().length / 2;
              var horz_donut_affected_legend = -4 * legendRectSize_affected;
              var vert_donut_affected_legend = i * height_donut_affected_legend - offset_donut_affected_legend;
              return 'translate(' + horz_donut_affected_legend + ',' + vert_donut_affected_legend + ')';
            });

          legend_donut_affected.append('rect')
            .attr('width', legendRectSize_affected)
            .attr('height', legendRectSize_affected)
            .style('fill', color_donut_affected)
            .style('stroke', color_donut_affected);

          legend_donut_affected.append('text')
            .attr('x', legendRectSize_affected + legendSpacing_affected)
            .attr('y', legendRectSize_affected - legendSpacing_affected)
            .text(function(d) { return typeFormatter(d); });
  // Tooltip
  path_affected.on("mousemove", function(d){
        //alert("hovered");
        tt_donut_affected.html("People affected from " + typeFormatter(d.data.type) + ": <strong>"+ d.data.percentage + "%</strong>")
          .style('top', d3.event.pageY - 12 + 'px')
          .style('left', d3.event.pageX + 25 + 'px')
          .style("display", "inline-block");;
      });
  path_affected
      .on("mouseout", function(d){
          tt_donut_affected.style("display", "none");
      });
});
