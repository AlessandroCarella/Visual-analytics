import { svg } from "../../index";
import { colorsOfLinks } from "../constants";
import { addNodeToAddedNodes, needToAddNode, getTypesOfLinks } from "../dataManagement";
import { refreshGraph } from "../refreshGraph";
import {
    blackColor,
    markersRefX, markersRefY, markerWidth, markerHeight,
    linksSizeMultiplier, labelsColor, labelsFontSize, labelsNodeMinRadiusToShowLabel,
    tooltipBackgroundColor,
    determineNodeColor
} from "./graphConstants";

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

////////////////////////////////////////

function createLinks(links) {
    getTypesOfLinks().forEach(typeOfLink => {
        const linkSelection = svg.selectAll(`line.link.${typeOfLink}`)
            .data(links.filter(d => d.typeOfLink === typeOfLink));

        linkSelection.enter().append('line')
            .attr('class', `link ${typeOfLink}`)
            .style('stroke', colorsOfLinks(typeOfLink))
            .style('stroke-width', d => Math.sqrt(d.weight) * linksSizeMultiplier)
            .attr("marker-end", `url(#arrow-${typeOfLink})`)
            .each(function (d) {
                d.initialColor = colorsOfLinks(d.typeOfLink);
            });

        linkSelection.exit().remove();
    });
}

function createNodes(nodes, targetsPerSourceCount, simulation, allPossibleSources, sourcesNotActiveButInGraph) {
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
        .style('fill', d => determineNodeColor(d))
        .style('stroke', blackColor)//TODO replace with data based on the type of node
        .style('stroke-width', 1)
        //.style('visibility', 'hidden') //debugging markers
        .call(d3.drag()
            .on('start', (event, d) => dragstarted(event, d, simulation))
            .on('drag', dragged)
            .on('end', (event, d) => dragended(event, d, simulation)));

    const allCircles = circles.merge(enteredCircles);

    allCircles.on('click', (event, d) => {
        if (needToAddNode(d)){
            addNodeToAddedNodes(d)
            refreshGraph();
        }
    });
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
            tooltip.transition().duration(0).style("opacity", 1);
            tooltip.html(d.id)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            tooltip.transition().duration(0).style("opacity", 0);
        });
}

export { createLinks, createNodes, createMarkers, createLabels, setupTooltip }