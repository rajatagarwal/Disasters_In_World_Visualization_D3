var width_donut_occurrence = 400;
var height_donut_occurrence = 400;
var radius_donut_occurrence = Math.min(width_donut_occurrence, height_donut_occurrence)/2;
var donut_thickness_occurrence = 75;
var legendRectSize_occurrence = 18;
var legendSpacing_occurrence = 4;

var color_donut_occurrence = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var svg_donut_occurrence = d3.select("#svg_donut_occurrence")
						.append("svg")
						.attr("width", width_donut_occurrence)
						.attr("height", height_donut_occurrence)
						.append("g")
						.attr("transform", "translate(" + (width_donut_occurrence/2) + "," + (height_donut_occurrence/2) + ")");
var arc_donut_occurrence = d3.arc()
						.innerRadius(radius_donut_occurrence - donut_thickness_occurrence)
						.outerRadius(radius_donut_occurrence);

var pie_occurrence = d3.pie()
					.value(function(d) { return d.occurrence; })
					.sort(null);

var tt_donut_occurrence = d3.select("#svg_donut_affected").append("div").attr("class", "tooltip");

function typeFormatter(type) {
    return type == "Extreme_temperature" ? "Extreme Temperature" : type
}

d3.csv("t2_donut_occurrence.csv", type, function(error, data_donut_occurrence) {
  if (error) throw error;
  var path_occurrence = svg_donut_occurrence.selectAll("path")
						.data(pie_occurrence(data_donut_occurrence))
						.enter()
						.append("path")
						.attr("d", arc_donut_occurrence)
						.attr("fill", function(d, i){
							return color_donut_occurrence(d.data.type);
						});
	// Get total 
  var total_occurrence = d3.sum(data_donut_occurrence, function(d){
  	return d.occurrence;
  });
  // Calculate percentage
  data_donut_occurrence.forEach(function(d) {
    	d.percentage = (+d.occurrence  / total_occurrence * 100).toFixed(2);
  });
  // Legend
  var legend_donut_occurrence = svg_donut_occurrence.selectAll('.legend')
            .data(color_donut_occurrence.domain())
            .enter()
            .append('g')
            .attr('class', 'legend_donut_affected')
            .attr('transform', function(d, i) {
              var height_donut_occurrence = legendRectSize_occurrence + legendSpacing_occurrence;
              var offset_donut_occurrence =  height_donut_occurrence * color_donut_occurrence.domain().length / 2;
              var horz_donut_occurrence = -4 * legendRectSize_occurrence;
              var vert_donut_occurrence = i * height_donut_occurrence - offset_donut_occurrence;
              return 'translate(' + horz_donut_occurrence + ',' + vert_donut_occurrence + ')';
            });

          legend_donut_occurrence.append('rect')
            .attr('width', legendRectSize_occurrence)
            .attr('height', legendRectSize_occurrence)
            .style('fill', color_donut_occurrence)
            .style('stroke', color_donut_occurrence);

          legend_donut_occurrence.append('text')
            .attr('x', legendRectSize_occurrence + legendSpacing_occurrence)
            .attr('y', legendRectSize_occurrence - legendSpacing_occurrence)
            .text(function(d) { return typeFormatter(d); });
  // Tooltip
  path_occurrence.on("mousemove", function(d){
        tt_donut_occurrence.html(typeFormatter(d.data.type) + " occurrences: <strong>"+ d.data.percentage + "%</strong>")
          .style('top', d3.event.pageY - 12 + 'px')
          .style('left', d3.event.pageX + 25 + 'px')
          .style("display", "inline-block");
      });
  path_occurrence
      .on("mouseout", function(d){
          tt_donut_occurrence.style("display", "none");
      });
});
