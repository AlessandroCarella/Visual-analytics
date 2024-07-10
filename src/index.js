const data = [
  {
    "type": "ownership",
    "weight": 0.90013963,
    "source": "Spanish Shrimp Carriers",
    "target": "12744",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 578,
    "targetY": 684
  },
  {
    "type": "partnership",
    "weight": 0.8458973,
    "source": "Spanish Shrimp Carriers",
    "target": "21323516",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 498,
    "targetY": 686
  },
  {
    "type": "partnership",
    "weight": 0.9648761,
    "source": "Spanish Shrimp Carriers",
    "target": "290834957",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 329,
    "targetY": 754
  },
  {
    "type": "ownership",
    "weight": 0.9642126,
    "source": "Spanish Shrimp Carriers",
    "target": "3506021",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 49,
    "targetY": 288
  },
  {
    "type": "family_relationship",
    "weight": 0.82348585,
    "source": "Spanish Shrimp Carriers",
    "target": "Conventionâ",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 132,
    "targetY": 410
  },
  {
    "type": "family_relationship",
    "weight": 0.8931523,
    "source": "Spanish Shrimp Carriers",
    "target": "2262",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 884,
    "targetY": 238
  },
  {
    "type": "family_relationship",
    "weight": 0.8393061,
    "source": "Spanish Shrimp Carriers",
    "target": "Ashley Davis",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 788,
    "targetY": 867
  },
  {
    "type": "family_relationship",
    "weight": 0.88508075,
    "source": "Spanish Shrimp Carriers",
    "target": "924",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 869,
    "targetY": 839
  },
  {
    "type": "family_relationship",
    "weight": 0.8865156,
    "source": "Spanish Shrimp Carriers",
    "target": "95",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 585,
    "targetY": 253
  },
  {
    "type": "membership",
    "weight": 0.8986875,
    "source": "Spanish Shrimp Carriers",
    "target": "Ancla Azul Company Solutions",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 996,
    "targetY": 164
  },
  {
    "type": "partnership",
    "weight": 0.87834406,
    "source": "Spanish Shrimp Carriers",
    "target": "185106",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 653,
    "targetY": 793
  },
  {
    "type": "family_relationship",
    "weight": 0.9664978,
    "source": "Spanish Shrimp Carriers",
    "target": "Stephanie Garner",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 741,
    "targetY": 919
  },
  {
    "type": "membership",
    "weight": 0.95491886,
    "source": "Spanish Shrimp Carriers",
    "target": "âpair",
    "sourceX": 114,
    "sourceY": 195,
    "targetX": 111,
    "targetY": 206
  }
];

const width = 1000;
const height = 1000;

const svg = d3.select('svg');

// Define color scale for different link types
const color = d3.scaleOrdinal()
  .domain(["ownership", "partnership", "family_relationship", "membership"])
  .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

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

