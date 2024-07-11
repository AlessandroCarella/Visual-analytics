const width = 1000;
const height = 1000;

const svg = d3.select('svg');

// Define color scale for different link types
const color = d3.scaleOrdinal()
  .domain(["ownership", "partnership", "family_relationship", "membership"])
  .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

// Load external data
d3.json('data/edgesCleanWithCoordinates.json').then(data => {

  // Create links
  svg.selectAll("line")
    .data(data)
    .enter().append("line")
    .attr("x1", d => d.sourceX)
    .attr("y1", d => d.sourceY)
    .attr("x2", d => d.targetX)
    .attr("y2", d => d.targetY)
    .style("stroke", d => color(d.type))
    .style("stroke-width", d => Math.sqrt(d.weight) * 2);

  // Create nodes (circles)
  const nodes = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => d.sourceX)
    .attr("cy", d => d.sourceY)
    .attr("r", 6)
    .style("fill", "#1f77b4") // Assuming the same color for all nodes
    .style("stroke", "#fff")
    .style("stroke-width", 1.5);

  // Label nodes
  svg.selectAll("text")
    .data(data)
    .enter().append("text")
    .attr("x", d => d.sourceX + 8)
    .attr("y", d => d.sourceY - 8)
    .text(d => d.source)
    .style("font-size", "10px") // Adjust font size as needed
    .style("fill", "#000"); // Adjust text color as needed

}).catch(error => {
  console.error('Error loading the data:', error);
});
