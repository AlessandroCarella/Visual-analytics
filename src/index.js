// Create a set of unique sources and targets
const width = 1399;
const height = 888;

const svg = d3.select('svg');

// Define color scale for different link types
const color = d3.scaleOrdinal()
  .domain(["ownership", "partnership", "family_relationship", "membership"])
  .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

// Load external data
d3.json('data/edgesCleanWithCoordinates cut.json').then(data => {
  const uniqueSources = Array.from(new Set(data.map(d => d.source)));
  const uniqueTargets = Array.from(new Set(data.map(d => d.target)));

  populateDropdown('#source-select', uniqueSources);
  populateDropdown('#target-select', uniqueTargets);

  d3.select('#source-select').on('change', function() {
    const selectedSource = this.value;
    if (selectedSource !== 'all') {
      d3.select('#target-select').property('value', 'all');
    }
    filterVisibilityBySource(selectedSource);
  });
  
  d3.select('#target-select').on('change', function() {
    const selectedTarget = this.value;
    if (selectedTarget !== 'all') {
      d3.select('#source-select').property('value', 'all');
    }
    filterVisibilityByTarget(selectedTarget);
  });
  
  setupGraph(data, ["ownership", "partnership", "family_relationship", "membership"]);

  addTypeButtonsEventListeners(data);
}).catch(error => {
  console.error('Error loading the data:', error);
});

function setupGraph (data, types){
  svg.selectAll(`line.link`).remove();
  svg.selectAll(`circle.source`).remove();
  svg.selectAll(`circle.target`).remove();
  svg.selectAll(`text.source`).remove();
  svg.selectAll(`text.target`).remove();

  console.log(`Graph setup for ${types.join(', ')}`);
  createLinks(data, types);
  createNodes(data, 'source', '#216b44');
  createNodes(data, 'target', '#c3c90e');
  createLabels(data, 'source');
  createLabels(data, 'target');
}

function populateDropdown(selector, items) {
  const dropdown = d3.select(selector);
  dropdown.selectAll('option').remove(); // Clear existing options
  dropdown.append('option').attr('value', 'all').text('All'); // Add "all" option
  items.forEach(item => {
    dropdown.append('option').attr('value', item).text(item);
  });
}

function filterVisibilityBySource(selectedSource) {
  svg.selectAll("circle.source, circle.target, line, text.source, text.target")
    .style("visibility", function(d) {
      return selectedSource === 'all' || d.source === selectedSource ? "visible" : "hidden";
    });
}

function filterVisibilityByTarget(selectedTarget) {
  svg.selectAll("circle.source, circle.target, line, text.source, text.target")
    .style("visibility", function(d) {
      return selectedTarget === 'all' || d.target === selectedTarget ? "visible" : "hidden";
    });
}

function createLinks(data, types) {
  types.forEach(type => {
    svg.selectAll(`line.link.${type}`)
      .data(data.filter(d => d.type === type))
      .enter().append("line")
      .attr("x1", d => d.sourceX)
      .attr("y1", d => d.sourceY)
      .attr("x2", d => d.targetX)
      .attr("y2", d => d.targetY)
      .attr("class", d => `link ${d.type}`)
      .style("stroke", d => color(d.type))
      .style("stroke-width", d => Math.sqrt(d.weight) * 3)
      .each(function(d) {
        d.initialColor = color(d.type);
      });
  });
}

function createNodes(data, className, fillColor) {
  svg.selectAll(`circle.${className}`)
    .data(data)
    .enter().append("circle")
    .attr("class", className)
    .attr("cx", d => d[`${className}X`])
    .attr("cy", d => d[`${className}Y`])
    .attr("r", 6)
    .style("fill", fillColor)
    .style("stroke", "#000")
    .style("stroke-width", 1);
}

function createLabels(data, className) {
  svg.selectAll(`text.${className}`)
    .data(data)
    .enter().append("text")
    .attr("class", className)
    .attr("x", d => d[`${className}X`] + 8)
    .attr("y", d => d[`${className}Y`] - 8)
    .text(d => d[className])
    .style("font-size", "10px")
    .style("fill", "#000");
}

function addTypeButtonsEventListeners(data) {
  const types = ["ownership", "partnership", "family_relationship", "membership"];
  const activeTypes = new Set(types);

  types.forEach(type => {
    d3.select(`#${type}`).on('click', function() {
      const isActive = d3.select(this).classed('active-button');
      d3.select(this).classed('active-button', !isActive).classed('inactive-button', isActive);

      if (isActive) {
        activeTypes.delete(type);
      } else {
        activeTypes.add(type);
      }
      
      console.log('Active types:', Array.from(activeTypes));
      setupGraph(data, Array.from(activeTypes))
    });
  });
}
