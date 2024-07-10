// Import D3
import * as d3 from 'd3';


const data = [
    { "type":"ownership", "weight":0.90013963, "source":"Spanish Shrimp Carriers", "target":"12744" },
    { "type":"partnership", "weight":0.8458973, "source":"Spanish Shrimp Carriers", "target":"21323516" },
    { "type":"partnership", "weight":0.9648761, "source":"Spanish Shrimp Carriers", "target":"290834957" },
    { "type":"ownership", "weight":0.9642126, "source":"Spanish Shrimp Carriers", "target":"3506021" },
    { "type":"family_relationship", "weight":0.82348585, "source":"Spanish Shrimp Carriers", "target":"Conventionâ" },
    { "type":"family_relationship", "weight":0.8931523, "source":"Spanish Shrimp Carriers", "target":"2262" },
    { "type":"family_relationship", "weight":0.8393061, "source":"Spanish Shrimp Carriers", "target":"Ashley Davis" },
    { "type":"family_relationship", "weight":0.88508075, "source":"Spanish Shrimp Carriers", "target":"924" },
    { "type":"family_relationship", "weight":0.8865156, "source":"Spanish Shrimp Carriers", "target":"95" },
    { "type":"membership", "weight":0.8986875, "source":"Spanish Shrimp Carriers", "target":"Ancla Azul Company Solutions" },
    { "type":"partnership", "weight":0.87834406, "source":"Spanish Shrimp Carriers", "target":"185106" }
];

// Convert target strings to unique nodes with ids
const nodesMap = new Map();
let nodeId = 0;

// Add Spanish Shrimp Carriers as a node
nodesMap.set("Spanish Shrimp Carriers", { id: nodeId++, name: "Spanish Shrimp Carriers" });

data.forEach(d => {
    if (!nodesMap.has(d.target)) {
        nodesMap.set(d.target, { id: nodeId++, name: d.target }); // Create a unique id for each target
    }
});

const nodes = Array.from(nodesMap.values());

const links = data.map(d => ({
    source: "Spanish Shrimp Carriers", // Use the node object instead of string
    target: nodes.find(node => node.name === d.target).id,
    type: d.type,
    weight: d.weight
}));

const width = 600;
const height = 400;

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Create force simulation
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Draw links
const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke-width", d => Math.sqrt(d.weight))
    .style("stroke", d => {
        if (d.type === "ownership") return "blue";
        else if (d.type === "partnership") return "green";
        else if (d.type === "family_relationship") return "red";
        else return "black";
    });

// Draw nodes
const node = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 8)
    .attr("fill", "gray");

node.append("title")
    .text(d => d.name);

// Define tick function
function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

// Run simulation
simulation.on("tick", ticked);

// Dragging function
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
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

// Apply dragging behavior
node.call(drag(simulation));
