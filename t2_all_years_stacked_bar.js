// for all years

var svg_all_years = d3.select("#svg_stacked_bar_all"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg_all_years.attr("width") - margin.left - margin.right,
    height = +svg_all_years.attr("height") - margin.top - margin.bottom,
    g = svg_all_years.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var stack_allYear = d3.stack();

function numFormatter(num) {
    return num > 99999 ? (num/1000000).toFixed(1) + 'M' : num
}

// for all years
d3.csv("disaster_data_v2.csv", type, function(error, data) {
    if (error) throw error;

    //data.sort(function(a, b) { return b.total - a.total; });
    x.domain(data.map(function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    z.domain(data.columns.slice(1));

    g.selectAll(".serie")
        .data(stack_allYear.keys(data.columns.slice(1))(data))
        .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) { return z(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return x(d.data.year); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
        .append("title")
        .text(function(d) {return "Year: "+ d.data.year +"\nPeople affected: " + numFormatter(d[1]-d[0])});

    g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)" );

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks(10).pop()))
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("fill", "#000")
        .text("People affected: Deaths, homeless & injured.");

    var legend = g.selectAll(".legend")
        .data(data.columns.slice(1).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
        .style("font", "10px sans-serif");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
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