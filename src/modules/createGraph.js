import * as d3 from "d3";
import { types, svg, color } from "../index";
import { findNumberOfTargets, removeDuplicates } from "./utils";
import { refreshGraph } from "./refreshGraph";

const graphDimensionsBorder = 25

const sourceAndTargetColor = '#04820f'
const sourceColor = '#821304'
const targetColor = '#042882'
const blackColor = '#000'

const markersRefX = 8
const markersRefY = 0
const markerWidth = 3
const markerHeight = 3

const linksSizeMultiplier = 3

const labelsColor = '#000'
const labelsFontSize = '10px'
const labelsNodeMinRadiusToShowLabel = 10

const tooltipBackgroundColor = "#fff"

function getGraphDimensions() {
    const { width, height } = document.querySelector('.graph').getBoundingClientRect();
    return { width: width - graphDimensionsBorder, height: height - graphDimensionsBorder };
}

function getPossibleNodes(data) {
    let sources = Array.from(new Set(data.map(d => d.source)));
    let targets = Array.from(new Set(data.map(d => d.target)));

    const sourcesTargets = sources.filter(value => targets.includes(value));

    targets = removeDuplicates(targets, sources);
    return { sources, targets, sourcesTargets };
}

function createNodesData(sources, targets, sourcesTargets) {
    const nodesData = [];

    sources.forEach(source => {
        nodesData.push({ id: source, type: 'source', alsoTarget: sourcesTargets.includes(source) });
    });

    targets.forEach(target => {
        nodesData.push({ id: target, type: 'target', alsoTarget: false });
    });

    return nodesData;
}

function createLinksData(data, nodes) {
    const links = [];

    data.forEach(d => {
        const link = {
            source: nodes.find(node => node.id === d.source),
            target: nodes.find(node => node.id === d.target),
            type: d.type,
            weight: d.weight
        };
        links.push(link);
    });

    return links;
}

function initializeSimulation(nodes, links, width, height, ticked) {
    return d3.forceSimulation(nodes)
        .force('link', d3.forceLink().id(d => d.id).links(links).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', () => ticked(width, height, links));
}

function createMarkers() {
    // Create the markers at the end
    svg.append("defs").selectAll("marker")
        .data(types)
        .enter().append("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", markersRefX)
        .attr("refY", markersRefY)
        .attr("fill", d => color(d))
        .attr("markerWidth", markerWidth)
        .attr("markerHeight", markerHeight)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowhead");
}

function aggregateLinks(links) {
    const aggregated = {};

    links.forEach(link => {
        const key = `${link.source.id}-${link.target.id}`;
        if (!aggregated[key]) {
            aggregated[key] = {
                source: link.source,
                target: link.target,
                types: [],
                weight: 0
            };
        }
        aggregated[key].types.push(link.type);
        aggregated[key].weight += link.weight;
    });

    return Object.values(aggregated);
}

function createLinks(links) {
    const aggregatedLinks = aggregateLinks(links);

    aggregatedLinks.forEach(link => {
        const { source, target, types, weight } = link;
        
        svg.append('line')
            .datum(link) // Bind the link data
            .attr('class', 'link')
            .style('stroke-width', Math.sqrt(weight) * linksSizeMultiplier)
            .attr("marker-end", `url(#arrow)`)
            .style('stroke', `url(#striped-${source.id}-${target.id})`);

        createStripedPattern(`striped-${source.id}-${target.id}`, types.map(type => color(type)));
    });
}

function createStripedPattern(patternId, colors) {
    const pattern = svg.append('defs').append('pattern')
        .attr('id', patternId)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 10)
        .attr('height', 10);

    colors.forEach((linkColor, index) => {
        pattern.append('rect')
            .attr('x', index * 5)
            .attr('width', 5)
            .attr('height', 10)
            .attr('fill', linkColor);
    });
}

function getIntersectionX(node1, node2, isSource) {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const r = node1.radius;

    const x = node1.x + (r / dist) * dx * (1);
    //console.log(`Intersection X for ${isSource ? 'source' : 'target'} ${node1.id}, with original X = ${node1.x} and new x = ${x} (radius = ${node1.radius})`);
    return x;
}

function getIntersectionY(node1, node2, isSource) {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const r = node1.radius;

    const y = node1.y + (r / dist) * dy * (1);
    //console.log(`Intersection Y for ${isSource ? 'source' : 'target'} ${node1.id}, with original Y = ${node1.y} and new y = ${y} (radius = ${node1.radius})`);
    return y;
}

function createNodes(nodes, targetsPerSourceCount, activeSources, data, simulation, sources) {
    const circles = svg.selectAll('circle').data(nodes);
    circles.exit().remove();

    const enteredCircles = circles.enter().append('circle')
        .attr('class', d => d.type)
        .attr('r', d => {
            if (d.type === 'source') {
                d.radius = Math.sqrt(targetsPerSourceCount[d.id] || 1) * 5;
            } else {
                d.radius = 6;
            }
            return d.radius;
        })
        .style('fill', d => d.alsoTarget ? sourceAndTargetColor : (d.type === 'source' ? sourceColor : targetColor))
        .style('stroke', blackColor)
        .style('stroke-width', 1)
        //.style('visibility', 'hidden') //debugging markers
        .call(d3.drag()
            .on('start', (event, d) => dragstarted(event, d, simulation))
            .on('drag', dragged)
            .on('end', (event, d) => dragended(event, d, simulation)));

    const allCircles = circles.merge(enteredCircles);

    allCircles.on('click', (event, d) => {
        console.log("clicked on:", d.id)
        if (sources.includes(d.id) && !activeSources.includes(d.id)) {
            console.log("sources.includes(d.id) && !activeSources.includes(d.id), refreshing graph")
            activeSources.push(d.id);
            refreshGraph(data, activeSources);
        }
    });
}

function createLabels(nodes, targetsPerSourceCount) {
    svg.selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('class', d => d.type)
        .text(d => {
            const radius = d.type === 'source' ? Math.sqrt(targetsPerSourceCount[d.id] || 1) * 5 : 6;
            return radius > labelsNodeMinRadiusToShowLabel ? d.id : '';
        })
        .style('font-size', labelsFontSize)
        .style('fill', labelsColor)
        .style('text-anchor', 'middle')
        .style('user-select', 'none')
        .style('pointer-events', 'none');
}

function setupTooltip() {
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", tooltipBackgroundColor)
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "3px")
        .style("pointer-events", "none");

    svg.selectAll('circle')
        .on('mouseover', (event, d) => {
            tooltip.transition().duration(0).style("opacity", 0.9);
            tooltip.html(d.id)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            tooltip.transition().duration(0).style("opacity", 0);
        });
}

function ticked(width, height, links) {
    svg.selectAll('line.link')
        .data(links) // Ensure you are binding the links data
        .attr('x1', d => getIntersectionX(d.source, d.target, true))
        .attr('y1', d => getIntersectionY(d.source, d.target, true))
        .attr('x2', d => getIntersectionX(d.target, d.source, false))
        .attr('y2', d => getIntersectionY(d.target, d.source, false));

    svg.selectAll('circle')
        .attr('cx', d => {
            d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
            return d.x;
        })
        .attr('cy', d => {
            d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
            return d.y;
        });

    svg.selectAll('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4);
}

function dragstarted(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function createGraph(data) {
    const { width, height } = getGraphDimensions();
    const { sources: sources, targets: targets, sourcesTargets: sourcesTargets } = getPossibleNodes(data);
    const targetsPerSourceCount = findNumberOfTargets(data);

    const nodes = createNodesData(sources, targets, sourcesTargets);
    const links = createLinksData(data, nodes, sourcesTargets);
    const simulation = initializeSimulation(nodes, links, width, height, () => ticked(width, height, links));

    createLinks(links);
    createNodes(nodes, targetsPerSourceCount, [], data, simulation, sources);
    createMarkers();
    createLabels(nodes, targetsPerSourceCount);
    setupTooltip();
}

export { createGraph }
