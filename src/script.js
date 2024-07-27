const width = 600;
const height = 400;

// Define the nodes and links
const nodes = [
    { id: 'A', radius: 20 },
    { id: 'B', radius: 30 }
];

const links = [
    { source: 'A', target: 'B' }
];

const svg = d3.select('svg');

// Create a group for the links
const linkGroup = svg.append('g')
    .attr('class', 'links');

// Create a group for the nodes
const nodeGroup = svg.append('g')
    .attr('class', 'nodes');

// Create links
linkGroup.selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('x1', d => nodes.find(n => n.id === d.source).x || 0)
    .attr('y1', d => nodes.find(n => n.id === d.source).y || 0)
    .attr('x2', d => nodes.find(n => n.id === d.target).x || 0)
    .attr('y2', d => nodes.find(n => n.id === d.target).y || 0);

// Create nodes
const nodeElements = nodeGroup.selectAll('g')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x || width / 2}, ${d.y || height / 2})`);

// Append circles to nodes
nodeElements.append('circle')
    .attr('r', d => d.radius)
    .attr('fill', '#f0f0f0')
    .attr('stroke', '#333');

// Append SVG icons to nodes
nodeElements.append('svg:image')
    .attr('xlink:href', '/svgs/questionMark.svg')
    .attr('x', d => -d.radius)
    .attr('y', d => -d.radius)
    .attr('width', d => 2 * d.radius)
    .attr('height', d => 2 * d.radius);

// Set node positions (for demonstration purposes)
nodes[0].x = 150;
nodes[0].y = 200;
nodes[1].x = 450;
nodes[1].y = 200;

// Update link positions
linkGroup.selectAll('line')
    .attr('x1', d => nodes.find(n => n.id === d.source).x)
    .attr('y1', d => nodes.find(n => n.id === d.source).y)
    .attr('x2', d => nodes.find(n => n.id === d.target).x)
    .attr('y2', d => nodes.find(n => n.id === d.target).y);
