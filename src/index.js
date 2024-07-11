const width = 1399;
const height = 888;

const svg = d3.select('svg');

// Define color scale for different link types
const color = d3.scaleOrdinal()
  .domain(["ownership", "partnership", "family_relationship", "membership"])
  .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

  // Load external data
  d3.json('data/edgesCleanWithCoordinates cut.json').then(data => {
// Create links
const links = svg.selectAll("line")
  .data(data)
  .enter().append("line")
  .attr("x1", d => d.sourceX)
  .attr("y1", d => d.sourceY)
  .attr("x2", d => d.targetX)
  .attr("y2", d => d.targetY)
  .attr("class", d => `link ${d.type}`)
  .style("stroke", d => color(d.type))
  .style("stroke-width", d => Math.sqrt(d.weight) * 3);

// Add button event listeners
const types = ["ownership", "partnership", "family_relationship", "membership"];
const activeTypes = new Set(types); // Initialize all types as active

types.forEach(type => {
  d3.select(`#${type}`).on('click', function() {
    const isActive = d3.select(this).classed('active-button');
    d3.select(this).classed('active-button', !isActive).classed('inactive-button', isActive);

    if (isActive) {
      activeTypes.delete(type);
    } else {
      activeTypes.add(type);
    }

    links.attr("class", d => {
      return `link ${d.type} ${activeTypes.has(d.type) ? '' : 'inactive'}`;
    });
  });
});



  // Create nodes for sources
  svg.selectAll("circle.source")
    .data(data)
    .enter().append("circle")
    .attr("class", "source")
    .attr("cx", d => d.sourceX)
    .attr("cy", d => d.sourceY)
    .attr("r", 6)
    .style("fill", "#216b44") // Assuming the same color for all nodes
    .style("stroke", "#000")
    .style("stroke-width", 1);

  // Create nodes for targets
  svg.selectAll("circle.target")
    .data(data)
    .enter().append("circle")
    .attr("class", "target")
    .attr("cx", d => d.targetX)
    .attr("cy", d => d.targetY)
    .attr("r", 6)
    .style("fill", "#c3c90e") // Assuming a different color for target nodes
    .style("stroke", "#000")
    .style("stroke-width", 1);

  // Label nodes for sources
  svg.selectAll("text.source")
    .data(data)
    .enter().append("text")
    .attr("class", "source")
    .attr("x", d => d.sourceX + 8)
    .attr("y", d => d.sourceY - 8)
    .text(d => d.source)
    .style("font-size", "10px") // Adjust font size as needed
    .style("fill", "#000"); // Adjust text color as needed

  // Label nodes for targets
  svg.selectAll("text.target")
    .data(data)
    .enter().append("text")
    .attr("class", "target")
    .attr("x", d => d.targetX + 8)
    .attr("y", d => d.targetY - 8)
    .text(d => d.target)
    .style("font-size", "10px") // Adjust font size as needed
    .style("fill", "#000"); // Adjust text color as needed
}).catch(error => {
  console.error('Error loading the data:', error);
});
