import * as d3 from 'd3';

// D3.js example
const d3Container = d3.select('#d3-container')
  .append('svg')
  .attr('width', 500)
  .attr('height', 500)
  .append('circle')
  .attr('cx', 250)
  .attr('cy', 250)
  .attr('r', 100)
  .style('fill', 'blue');

// Data
const data = [
    {
        "type": "ownership",
        "weight": 0.90013963,
        "source": "Spanish Shrimp  Carriers",
        "target": "12744",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 578,
        "targetY": 684
    },
    {
        "type": "partnership",
        "weight": 0.8458973,
        "source": "Spanish Shrimp  Carriers",
        "target": "21323516",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 498,
        "targetY": 686
    },
    {
        "type": "partnership",
        "weight": 0.9648761,
        "source": "Spanish Shrimp  Carriers",
        "target": "290834957",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 329,
        "targetY": 754
    },
    {
        "type": "ownership",
        "weight": 0.9642126,
        "source": "Spanish Shrimp  Carriers",
        "target": "3506021",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 49,
        "targetY": 288
    },
    {
        "type": "family_relationship",
        "weight": 0.82348585,
        "source": "Spanish Shrimp  Carriers",
        "target": "Conventionâ",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 132,
        "targetY": 410
    },
    {
        "type": "family_relationship",
        "weight": 0.8931523,
        "source": "Spanish Shrimp  Carriers",
        "target": "2262",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 884,
        "targetY": 238
    },
    {
        "type": "family_relationship",
        "weight": 0.8393061,
        "source": "Spanish Shrimp  Carriers",
        "target": "Ashley Davis",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 788,
        "targetY": 867
    },
    {
        "type": "family_relationship",
        "weight": 0.88508075,
        "source": "Spanish Shrimp  Carriers",
        "target": "924",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 869,
        "targetY": 839
    },
    {
        "type": "family_relationship",
        "weight": 0.8865156,
        "source": "Spanish Shrimp  Carriers",
        "target": "95",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 585,
        "targetY": 253
    },
    {
        "type": "membership",
        "weight": 0.8986875,
        "source": "Spanish Shrimp  Carriers",
        "target": "Ancla Azul Company Solutions",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 996,
        "targetY": 164
    },
    {
        "type": "partnership",
        "weight": 0.87834406,
        "source": "Spanish Shrimp  Carriers",
        "target": "185106",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 653,
        "targetY": 793
    },
    {
        "type": "family_relationship",
        "weight": 0.9664978,
        "source": "Spanish Shrimp  Carriers",
        "target": "Stephanie Garner",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 741,
        "targetY": 919
    },
    {
        "type": "membership",
        "weight": 0.95491886,
        "source": "Spanish Shrimp  Carriers",
        "target": "âpair",
        "sourceX": 114,
        "sourceY": 195,
        "targetX": 111,
        "targetY": 206
    }
];

// SVG setup
const svg = d3.select('#d3-container');
const width = +svg.attr('width');
const height = +svg.attr('height');
const g = svg.append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

// Simulation setup with forceX and forceY
const simulation = d3.forceSimulation()
  .force('link', d3.forceLink().id(d => d.id))
  .force('charge', d3.forceManyBody().strength(-400))
  .force('center', d3.forceCenter(width / 2, height / 2));

// Add links
const links = data.map(d => Object.create(d));
const nodes = {};

links.forEach(link => {
  link.source = nodes[link.source] || (nodes[link.source] = {id: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {id: link.target});
});

const link = g.append('g')
  .attr('class', 'links')
  .selectAll('line')
  .data(links)
  .enter().append('line')
  .attr('class', 'link');

const node = g.append('g')
  .attr('class', 'nodes')
  .selectAll('circle')
  .data(Object.values(nodes))
  .enter().append('circle')
  .attr('class', 'node')
  .attr('r', 5)
  .attr('fill', d => d.id === "Spanish Shrimp  Carriers" ? '#f00' : '#1f77b4') // Highlight the main node
  .call(drag(simulation));

node.append('title')
  .text(d => d.id);

simulation
  .nodes(Object.values(nodes))
  .on('tick', ticked);

simulation.force('link')
  .links(links);

function ticked() {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);
}

function drag(simulation) {

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
}
