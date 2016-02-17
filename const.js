// Array of line colors, starting from 0 (http://www.december.com/html/spec/colorsvg.html):
var colors = ["steelblue", "orangered", "limegreen", "gold",
              "blue", "red", "green", "darkorange",
              "indigo", "darkred", "darkgreen", "gray"];
var minYnow = 0; var maxYnow = 0; //initialize the min/max value graphed
var defaultData = [ {"x": 1998, "y": 0.737}, {"x": 1999, "y": 1.02}, {"x": 2000, "y": 1.293}, {"x": 2001, "y": 1.393},
                    {"x": 2002, "y": 1.53}, {"x": 2003, "y": 1.43}, {"x": 2004, "y": 1.65}, {"x": 2005, "y": 0.96},
                    {"x": 2006, "y": 0.74}, {"x": 2007, "y": 1.02}, {"x": 2008, "y": 1.13}, {"x": 2009, "y": 1.27},
                    {"x": 2010, "y": 0.53}, {"x": 2011, "y": -0.54}, {"x": 2012, "y": -1.66}, {"x": 2013, "y": -0.11} ];
// Set the dimensions of the canvas:
var margin = {top: 30, right: 20, bottom: 30, left:50},
    width = 720 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;
// Parse the date:
var parseDate = d3.time.format("%Y").parse;
// Set the ranges:
var x = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height,0]);
// Define the axes:
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(6),
    yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);
// Add the svg canvas:
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
// Grid info:
function make_x_axis() {
    return d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(24)
}
function make_y_axis() {
    return d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(20)
}
// Update grid:
function upd_grid() {
    d3.selectAll(".grid").remove();
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_axis()
        .tickSize(-height, 0, 0)
        .tickFormat("")
    )
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat("")
    )
}