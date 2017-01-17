// Occurrences
var svg_occurrences = d3.select("#svg_occurrences_1900_2016"),
    margin_occurrences = {top: 20, right: 20, bottom: 30, left: 40},
    width_occurrences = +svg_occurrences.attr("width") - margin_occurrences.left - margin_occurrences.right,
    height_occurrences = +svg_occurrences.attr("height") - margin_occurrences.top - margin_occurrences.bottom,
    g_occurrences = svg_occurrences.append("g").attr("transform", "translate(" + margin_occurrences.left + "," + margin_occurrences.top + ")");
var x_occurrences = d3.scaleBand()
    .rangeRound([0, width_occurrences])
    .padding(0.1)
    .align(0.1);
var y_occurrences = d3.scaleLinear()
    .rangeRound([height_occurrences, 0]);
var z_occurrences = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
var stack_occurrences = d3.stack();

// for all years
d3.csv("t2_occurrence_disaster_all_year.csv", type, function(error, data_occurrences) {
  if (error) throw error;

  //data.sort(function(a, b) { return b.total - a.total; });
  x_occurrences.domain(data_occurrences.map(function(d) { return d.year; }));
  y_occurrences.domain([0, d3.max(data_occurrences, function(d) { return d.total; })]).nice();
  z_occurrences.domain(data_occurrences.columns.slice(1));
  g_occurrences.selectAll(".serie")
    .data(stack_occurrences.keys(data_occurrences.columns.slice(1))(data_occurrences))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z_occurrences(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x_occurrences(d.data.year); })
      .attr("y", function(d) { return y_occurrences(d[1]); })
      .attr("height", function(d) { return y_occurrences(d[0]) - y_occurrences(d[1]); })
      .attr("width", x_occurrences.bandwidth())
      .append("title")
      .text(function(d) {return "Year: "+ d.data.year +"\nDisaster Occurrences: " + (y_occurrences(d[0]) - y_occurrences(d[1])) });;
  g_occurrences.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height_occurrences + ")")
      .call(d3.axisBottom(x_occurrences))
      .selectAll("text")  
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", ".15em")
                  .attr("transform", "rotate(-65)" );;
  g_occurrences.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y_occurrences).ticks(10, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y_occurrences(y_occurrences.ticks(10).pop()))
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .text("Number of disaster occured.");
  var legend_occurrences = g_occurrences.selectAll(".legend")
    .data(data_occurrences.columns.slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .style("font", "10px sans-serif");
  legend_occurrences.append("rect")
      .attr("x", width_occurrences - 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z_occurrences);
  legend_occurrences.append("text")
      .attr("x", width_occurrences - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d; });
});
function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}