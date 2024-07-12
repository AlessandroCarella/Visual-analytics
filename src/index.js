const { active, filter } = require("d3");

const width = 1399;
const height = 888;

const types = ["ownership", "partnership", "family_relationship", "membership"];
var activeButtons = new Set(types);
var source = "all"
var target = "all"

const svg = d3.select('svg');

const color = d3.scaleOrdinal()
  .domain(types)
  .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

d3.json('data/edgesCleanWithCoordinates.json')
  .then(data => {
    const uniqueSources = getUniqueItems(data, 'source');
    const uniqueTargets = getUniqueItems(data, 'target');

    populateDropdown('#source-select', uniqueSources);
    populateDropdown('#target-select', uniqueTargets);

    addDropdownEventListeners(data);

    createGraph(data);
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
  
  //if the source has been changed
  if (selectedSource === selectedValue){
    d3.select(`#target-select`).property('value', 'all');
  }
  // if the target has been changed
  else if (selectedTarget === selectedValue){
    d3.select(`#source-select`).property('value', 'all');
  }
  //else reset everything
  else {
    d3.select(`#source-select`).property('value', 'all');
    d3.select(`#target-select`).property('value', 'all');
  }

  refreshGraph(data);
}

function refreshGraph(data) {
  const selectedSource = d3.select(`#source-select`).property('value');
  const selectedTarget = d3.select(`#target-select`).property('value');
  const activeTypes = Array.from(activeButtons);

  hideAllGraphElements();

  if (selectedSource === 'all' && selectedTarget === 'all') {
    // Show all elements for active types
    refreshLinks(data, activeTypes);
    refreshNodes(data, 'source', '#216b44', new Set(data.map(d => d.source)));
    refreshNodes(data, 'target', '#c3c90e', new Set(data.map(d => d.target)));
    refreshLabels(data, 'source', new Set(data.map(d => d.source)));
    refreshLabels(data, 'target', new Set(data.map(d => d.target)));
  } else {
    // Filter data based on selected source and/or target
    const filteredData = data.filter(d => 
      (selectedSource === 'all' || d.source === selectedSource) &&
      (selectedTarget === 'all' || d.target === selectedTarget)
    );

    const activeSources = new Set(filteredData.map(d => d.source));
    const activeTargets = new Set(filteredData.map(d => d.target));

    refreshNodes(filteredData, 'source', '#216b44', activeSources);
    refreshNodes(filteredData, 'target', '#c3c90e', activeTargets);
    refreshLabels(filteredData, 'source', activeSources);
    refreshLabels(filteredData, 'target', activeTargets);
    refreshLinks(filteredData, activeTypes, activeSources, activeTargets);
  }
}

function hideAllGraphElements() {
  svg.selectAll('line.link, circle.source, circle.target, text.source, text.target')
    .style('visibility', 'hidden');
}

function refreshLinks(filteredData, types, activeSources, activeTargets) {
  types.forEach(type => {
    // Hide all links initially
    svg.selectAll(`line.link.${type}`)
      .style('visibility', 'hidden');

    // Update the positions and visibility of the filtered links
    svg.selectAll(`line.link.${type}`)
      .data(filteredData.filter(d => d.type === type && activeSources.has(d.source) && activeTargets.has(d.target)))
      .attr('x1', d => d.sourceX)
      .attr('y1', d => d.sourceY)
      .attr('x2', d => d.targetX)
      .attr('y2', d => d.targetY)
      .style('visibility', 'visible');
  });
}

function refreshNodes(filteredData, className, fillColor, activeNodes) {
  svg.selectAll(`circle.${className}`)
    .data(filteredData.filter(d => activeNodes.has(d[className])))
    .style('visibility', 'visible')  // Only show the filtered nodes
    .attr('cx', d => d[`${className}X`])
    .attr('cy', d => d[`${className}Y`])
    .attr('r', 6)
    .style('fill', fillColor)
    .style('stroke', '#000')
    .style('stroke-width', 1);
}

function refreshLabels(filteredData, className, activeNodes) {
  svg.selectAll(`text.${className}`)
    .data(filteredData.filter(d => activeNodes.has(d[className])))
    .style('visibility', 'visible')  // Only show the filtered labels
    .attr('x', d => d[`${className}X`] + 8)
    .attr('y', d => d[`${className}Y`] - 8)
    .text(d => d[className])
    .style('font-size', '10px')
    .style('fill', '#000');
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

function createGraph(data) {
  const activeData = data.filter(d => types.includes(d.type));

  const activeSources = new Set(activeData.map(d => d.source));
  const activeTargets = new Set(activeData.map(d => d.target));

  createLinks(activeData);
  createNodes(activeData, 'source', '#216b44', activeSources);
  createNodes(activeData, 'target', '#c3c90e', activeTargets);
  createLabels(activeData, 'source', activeSources);
  createLabels(activeData, 'target', activeTargets);
}

function createLinks(data) {
  types.forEach(type => {
    svg.selectAll(`line.link.${type}`)
      .data(data.filter(d => d.type === type))
      .enter().append('line')
      .attr('x1', d => d.sourceX)
      .attr('y1', d => d.sourceY)
      .attr('x2', d => d.targetX)
      .attr('y2', d => d.targetY)
      .attr('class', `link ${type}`)
      .style('stroke', color(type))
      .style('stroke-width', d => Math.sqrt(d.weight) * 3)
      .each(function(d) {
        d.initialColor = color(d.type);
      });
  });
}

function createNodes(data, className, fillColor, activeNodes) {
  svg.selectAll(`circle.${className}`)
    .data(data.filter(d => activeNodes.has(d[className])))
    .enter().append('circle')
    .attr('class', className)
    .attr('cx', d => d[`${className}X`])
    .attr('cy', d => d[`${className}Y`])
    .attr('r', 6)
    .style('fill', fillColor)
    .style('stroke', '#000')
    .style('stroke-width', 1);
}

function createLabels(data, className, activeNodes) {
  svg.selectAll(`text.${className}`)
    .data(data.filter(d => activeNodes.has(d[className])))
    .enter().append('text')
    .attr('class', className)
    .attr('x', d => d[`${className}X`] + 8)
    .attr('y', d => d[`${className}Y`] - 8)
    .text(d => d[className])
    .style('font-size', '10px')
    .style('fill', '#000');
}
