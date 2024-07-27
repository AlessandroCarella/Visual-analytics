import * as d3 from 'd3';
import { svg } from "../../index";
import { colorsOfLinks, companiesToInvestigate } from "../constants";
import { addNodeToAddedNodes, clickableNode, getTypesOfLinks, setLastAddedNodeId } from "../dataManagement";
import { refreshGraph } from "../refreshGraph";
import {
    determineNodeBorderColor,
    determineNodeColor,
    labelsColor, labelsFontSize, labelsNodeMinRadiusToShowLabel,
    linksSizeMultiplier,
    markerHeight,
    markersRefX, markersRefY, markerWidth,
    nodeBorderSize,
    svgSize,
    tooltipBackgroundColor
} from "./graphConstants";

function dragstarted(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {    
    d3.selectAll('div-tooltip.tooltip').style('opacity', 0); // Hide tooltip on click
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

////////////////////////////////////////
// Cache for preloaded SVGs
const svgCache = {};

async function preloadSvgs() {
    const iconMap = {
        null: '../svgs/questionMark.svg',
        'company': '../svgs/company.svg',
        'event': '../svgs/event.svg',
        'location': '../svgs/location.svg',
        'movement': '../svgs/movement.svg',
        'organization': '../svgs/organization.svg',
        'person': '../svgs/person.svg',
        'political_organization': '../svgs/politicalOrganization.svg',
        'vessel': '../svgs/vessel.svg'
    };

    const promises = Object.entries(iconMap).map(async ([type, url]) => {
        const response = await fetch(url);
        const text = await response.text();
        svgCache[type] = text;
    });

    // Preload all SVGs
    await Promise.all(promises);
}

function createNodes(nodes, targetsPerSourceCount, sourcesPerTargetCount, simulation) {
    // Bind data to existing groups
    const nodeGroups = svg.selectAll('g.node').data(nodes, d => d.id);

    // Remove old groups
    nodeGroups.exit().remove();

    // Enter selection for new groups
    const enteredNodeGroups = nodeGroups.enter().append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', (event, d) => dragstarted(event, d, simulation))
            .on('drag', dragged)
            .on('end', (event, d) => dragended(event, d, simulation)))
        .on('click', (event, d) => {
            if (clickableNode(d)) {
                addNodeToAddedNodes(d);
                setLastAddedNodeId(d.id);
                refreshGraph();
            }
        });

    // Append circles to the groups
    enteredNodeGroups.append('circle')
        .attr('class', d => d.type)
        .attr('r', d => {
            d.radius = calculateRadius(d, targetsPerSourceCount, sourcesPerTargetCount);
            return d.radius;
        })
        .style('stroke-width', nodeBorderSize)
        .style('fill', 'transparent') // debugging markers
        .style('stroke', d => determineNodeColor(d));

    // Append SVG icons to the groups
    enteredNodeGroups.each(function (d) {
        const nodeGroup = d3.select(this);
        const svgString = svgCache[d.nodeType] || svgCache['null'];
        const radius = calculateRadius(d, targetsPerSourceCount, sourcesPerTargetCount);

        // Create a temporary div to parse the SVG string
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgString;
        const svgElement = tempDiv.querySelector('svg');

        if (svgElement) {
            // Remove existing SVG if any
            nodeGroup.select('svg').remove();

            // Adjust SVG properties and append to the group
            const newSvg = nodeGroup.append(() => svgElement)
                .attr('width', radius * 2)
                .attr('height', radius * 2);

            // Adjust SVG position
            newSvg.attr('x', -radius)
                  .attr('y', -radius);

            // Adjust paths within the SVG
            newSvg.selectAll('path')
                  .attr('stroke', determineNodeColor(d));
        }
    });

    // Merge entered groups with existing ones
    nodeGroups.merge(enteredNodeGroups);
}



function createLinks(links) {
    getTypesOfLinks().forEach(typeOfLink => {
        const linkSelection = svg.selectAll(`line.link.${typeOfLink}`)
            .data(links.filter(d => d.typeOfLink === typeOfLink));

        linkSelection.enter().append('line')
            .attr('class', `link ${typeOfLink}`)
            .style('stroke', colorsOfLinks(typeOfLink) || 'black')
            .style('stroke-width', d => Math.sqrt(d.weight) * linksSizeMultiplier)
            .attr("marker-end", `url(#arrow-${typeOfLink})`)
            .each(function (d) {
                d.initialColor = colorsOfLinks(d.typeOfLink);
            });

        linkSelection.exit().remove();
    });
}

function calculateRadius(d, targetsPerSourceCount, sourcesPerTargetCount) {
    //when the node is not both a source and a target the value in one of the 2 arrays
    //is going to be undefined
    //i prefer to handle this issue here rather than in the findPerSourceNumberOfTargetsOrOpposite
    //function in utils
    if (targetsPerSourceCount[d.id] === undefined) {
        targetsPerSourceCount[d.id] = 0;
    }
    if (sourcesPerTargetCount[d.id] === undefined) {
        sourcesPerTargetCount[d.id] = 0;
    }

    const radius = Math.sqrt(targetsPerSourceCount[d.id] + sourcesPerTargetCount[d.id]) * 3;
    return radius === 0 ? 1 : radius;
}

function createMarkers() {
    // Create the markers at the end
    svg.append("defs").selectAll("marker")
        .data(getTypesOfLinks())
        .enter().append("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", markersRefX)
        .attr("refY", markersRefY)
        .attr("fill", d => colorsOfLinks(d))
        .attr("markerWidth", markerWidth)
        .attr("markerHeight", markerHeight)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowhead");
}

function createLabels(nodes, targetsPerSourceCount, sourcesPerTargetCount) {
    svg.selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('class', d => d.type)
        .text(d => {
            const radius = calculateRadius(d, targetsPerSourceCount, sourcesPerTargetCount)
            return radius > labelsNodeMinRadiusToShowLabel ? d.id : '';
        })
        .style('font-size', labelsFontSize)
        .style('fill', labelsColor)
        .style('text-anchor', 'middle')
        .style('user-select', 'none')
        .style('pointer-events', 'none');
}

function setupTooltip(targetsPerSourceCount, sourcesPerTargetCount) {
    const tooltip = d3.select("body").append("div-tooltip")
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
            const nodeType = d.nodeType ? d.nodeType : "Unknown";
            const country = d.country ? d.country : "Unknown";

            tooltip.transition().duration(0).style("opacity", 1);
            tooltip.html(`
                <div>${d.id}</div>
                <div>Node type: ${nodeType}</div>
                <div>Country: ${country}</div>
                <div>N. sources: ${companiesToInvestigate.includes(d.id) ? sourcesPerTargetCount[d.id] - (companiesToInvestigate.length - 1) : sourcesPerTargetCount[d.id]}</div>
                <div>N. targets: ${companiesToInvestigate.includes(d.id) ? targetsPerSourceCount[d.id] - (companiesToInvestigate.length - 1) : targetsPerSourceCount[d.id]}</div>
            `)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            tooltip.transition().duration(0).style("opacity", 0);
        });
}

export { preloadSvgs, createLabels, createLinks, createMarkers, createNodes, setupTooltip };
