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
    filterVisibilityBySource(this.value);
  });

  d3.select('#target-select').on('change', function() {
    filterVisibilityByTarget(this.value);
  });

  createLinks(data);
  createNodes(data, 'source', '#216b44');
  createNodes(data, 'target', '#c3c90e');
  createLabels(data, 'source');
  createLabels(data, 'target');

  addTypeButtonsEventListeners();
}).catch(error => {
  console.error('Error loading the data:', error);
});

function populateDropdown(selector, items) {
  const dropdown = d3.select(selector);
  items.forEach(item => {
    dropdown.append('option').attr('value', item).text(item);
  });
}

function filterVisibilityBySource(selectedSource) {
  const visibility = selectedSource === 'all' ? "visible" : "hidden";
  svg.selectAll("circle.source, circle.target, line, text.source, text.target")
    .style("visibility", d => d.source === selectedSource || visibility);
}

function filterVisibilityByTarget(selectedTarget) {
  const visibility = selectedTarget === 'all' ? "visible" : "hidden";
  svg.selectAll("circle.source, circle.target, line, text.source, text.target")
    .style("visibility", d => d.target === selectedTarget || visibility);
}

function createLinks(data) {
  svg.selectAll("line")
    .data(data)
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

function addTypeButtonsEventListeners() {
  const types = ["ownership", "partnership", "family_relationship", "membership"];
  const activeTypes = new Set(types);

  types.forEach(type => {
    d3.select(`#${type}`).on('click', function() {
      const isActive = d3.select(this).classed('active-button');
      d3.select(this).classed('active-button', !isActive).classed('inactive-button', isActive);

      if (isActive) {
        activeTypes.delete(type);
        svg.selectAll(`line.link.${type}`).style("stroke", "#FFFFFF");
      } else {
        activeTypes.add(type);
        svg.selectAll(`line.link.${type}`).style("stroke", color(type));
      }
    });
  });
}
