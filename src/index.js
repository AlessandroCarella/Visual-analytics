const width = 1399;
const height = 888;

const types = ["ownership", "partnership", "family_relationship", "membership"];
var activeButtons = new Set(types);
var source = "all"
var target = "all"

const svg = d3.select('svg');

const color = d3.scaleOrdinal()
  .domain(["ownership", "partnership", "family_relationship", "membership"])
  .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

d3.json('data/edgesCleanWithCoordinates cut.json')
  .then(data => {
    const uniqueSources = getUniqueItems(data, 'source');
    const uniqueTargets = getUniqueItems(data, 'target');

    populateDropdown('#source-select', uniqueSources);
    populateDropdown('#target-select', uniqueTargets);

    addDropdownEventListeners(data);

    createGraph(data, ["ownership", "partnership", "family_relationship", "membership"]);
    addTypeButtonsEventListeners(data);
  })
  .catch(error => console.error('Error loading the data:', error));

function getUniqueItems(data, key) {
  return Array.from(new Set(data.map(d => d[key])));
}

function populateDropdown(selector, items) {
  const dropdown = d3.select(selector);
  dropdown.selectAll('option').remove();
  dropdown.append('option').attr('value', 'all').text('All');
  items.forEach(item => dropdown.append('option').attr('value', item).text(item));
  dropdown.property('value', 'all');
}

function addDropdownEventListeners(data) {
  d3.select('#source-select').on('change', function() {
    handleDropdownChange(this.value, 'source', data);
  });

  d3.select('#target-select').on('change', function() {
    handleDropdownChange(this.value, 'target', data);
  });
}

function handleDropdownChange(selectedValue, type, data) {
  var selectedSource = d3.select(`#source-select`).property('value')
  var selectedTarget = d3.select(`#target-select`).property('value')
  
  if (selectedSource === selectedValue){
    d3.select(`#target-select`).property('value', 'all');
  }
  else if (selectedTarget === selectedValue){
    d3.select(`#source-select`).property('value', 'all');
  }
  else {
    d3.select(`#source-select`).property('value', 'all');
    d3.select(`#target-select`).property('value', 'all');
  }

  refreshGraph(data);
}

function refreshGraph(data) {
  const selectedSource = d3.select(`#source-select`).property('value')
  const selectedTarget = d3.select(`#target-select`).property('value')
  const activeButtons = Array.from(activeButtons)

  console.log(selectedSource)
  console.log(selectedTarget)
  console.log(activeButtons)

  //hideAllGraphElements();

}

function hideAllGraphElements() {
  svg.selectAll(`line.link, circle.source, circle.target, text.source, text.target`)
    .style("visibility", "hidden");
}

function refreshLinks(data, types) {
  types.forEach(type => {
    svg.selectAll(`line.link.${type}`)
      .data(data.filter(d => d.type === type))
      .style("visibility", "visible");
  });
}

function refreshNodes(data, className, fillColor, activeNodes) {
  svg.selectAll(`circle.${className}`)
    .data(data.filter(d => activeNodes.has(d[className])))
    .style("visibility", "visible");
}

function refreshLabels(data, className, activeNodes) {
  svg.selectAll(`text.${className}`)
    .data(data.filter(d => activeNodes.has(d[className])))
    .style("visibility", "visible");
}

function addTypeButtonsEventListeners(data) {
  types.forEach(type => {
    d3.select(`#${type}`).on('click', function() {
      const isActive = d3.select(this).classed('active-button');
      d3.select(this).classed('active-button', !isActive).classed('inactive-button', isActive);

      if (isActive) {
        activeButtons.delete(type);
      } else {
        activeButtons.add(type);
      }

      refreshGraph(data);
    });
  });
}

function createGraph(data, types) {
  console.log(`Graph setup for ${types.join(', ')}`);
  const activeData = filterDataByTypes(data, types);

  const activeSources = new Set(activeData.map(d => d.source));
  const activeTargets = new Set(activeData.map(d => d.target));

  createLinks(activeData, types);
  createNodes(activeData, 'source', '#216b44', activeSources);
  createNodes(activeData, 'target', '#c3c90e', activeTargets);
  createLabels(activeData, 'source', activeSources);
  createLabels(activeData, 'target', activeTargets);
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
      .attr("class", `link ${type}`)
      .style("stroke", color(type))
      .style("stroke-width", d => Math.sqrt(d.weight) * 3)
      .each(function(d) {
        d.initialColor = color(d.type);
      });
  });
}

function createNodes(data, className, fillColor, activeNodes) {
  svg.selectAll(`circle.${className}`)
    .data(data.filter(d => activeNodes.has(d[className])))
    .enter().append("circle")
    .attr("class", className)
    .attr("cx", d => d[`${className}X`])
    .attr("cy", d => d[`${className}Y`])
    .attr("r", 6)
    .style("fill", fillColor)
    .style("stroke", "#000")
    .style("stroke-width", 1);
}

function createLabels(data, className, activeNodes) {
  svg.selectAll(`text.${className}`)
    .data(data.filter(d => activeNodes.has(d[className])))
    .enter().append("text")
    .attr("class", className)
    .attr("x", d => d[`${className}X`] + 8)
    .attr("y", d => d[`${className}Y`] - 8)
    .text(d => d[className])
    .style("font-size", "10px")
    .style("fill", "#000");
}

