import * as d3 from "d3";
import { svg } from "../../index";
import { colorsOfLinks, companiesToInvestigate } from "../constants";
import {
    getCurrentData,
    getCurrentlyClickedId,
    getTypesOfLinks,
    setCurrentlyClickedId
} from "../dataManagement";
import { refreshGraph } from "../refreshGraph";
import {
    defaultNodeOpacity,
    determineNodeBorderColor,
    determineNodeColor,
    labelsColor,
    labelsFontSize,
    labelsNodeMinRadiusToShowLabel,
    linksSizeMultiplier,
    markerHeight,
    markersRefX,
    markersRefY,
    markerWidth,
    nodeBorderSize,
    nonHighlightedNodeOpacity,
    svgSize,
    tooltipBackgroundColor,
} from "./graphConstants";
import { isObjectEmpty } from "../utils";
import { showContextMenu } from "../contextMenu";
import { findConnectedNodes, highlightConnectedNodes, resetHighlights } from "./nodeClick";

function dragstarted(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d3.selectAll("div-tooltip.tooltip").style("visibility", "hidden"); // Hide tooltip on click
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d, simulation) {
    d3.selectAll("div-tooltip.tooltip").style("visibility", "visible");
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

////////////////////////////////////////
// Cache for preloaded SVGs
const svgCache = {};

async function preloadSvgs() {
    const iconMap = {
        Unknown: "../svgs/questionMark.svg",
        company: "../svgs/company.svg",
        event: "../svgs/event.svg",
        location: "../svgs/location.svg",
        movement: "../svgs/movement.svg",
        organization: "../svgs/organization.svg",
        person: "../svgs/person.svg",
        political_organization: "../svgs/politicalOrganization.svg",
        vessel: "../svgs/vessel.svg",
    };

    const promises = Object.entries(iconMap).map(async ([type, url]) => {
        const response = await fetch(url);
        const text = await response.text();
        svgCache[type] = text;
    });

    // Preload all SVGs
    await Promise.all(promises);
}

function handleClick(event, d) {
    resetHighlights();

    const connectedNodes = findConnectedNodes(d);
    
    if (d.id !== getCurrentlyClickedId()) {
        highlightConnectedNodes(d, connectedNodes);
        setCurrentlyClickedId(d.id);
    } else {
        setCurrentlyClickedId(null);
    }
}

function appendCircles(
    nodeGroups,
    nodes,
    targetsPerSourceCount,
    sourcesPerTargetCount
) {
    nodeGroups
        .append("circle")
        .attr("class", (d) => d.type)
        .attr("r", (d) => {
            d.radius = calculateRadius(
                d,
                targetsPerSourceCount,
                sourcesPerTargetCount
            );
            return d.radius;
        })
        .style("stroke-width", nodeBorderSize)
        .style("fill", "black") // debugging markers
        .style("stroke", (d) => determineNodeColor(d));
}

function appendSVGIcons(
    nodeGroups,
    nodes,
    targetsPerSourceCount,
    sourcesPerTargetCount
) {
    nodeGroups.each(function (d) {
        const nodeGroup = d3.select(this);
        const nodeType =
            typeof d.nodeType === "object"
                ? d.nodeType?.nodeType || "Unknown"
                : d.nodeType || "Unknown";
        const svgString = svgCache[nodeType];
        const radius = calculateRadius(
            d,
            targetsPerSourceCount,
            sourcesPerTargetCount
        );
        const newRadius = getNewRadius(nodeType, radius);

        // Create a temporary div to parse the SVG string
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = svgString;
        const svgElement = tempDiv.querySelector("svg");

        if (svgElement) {
            // Remove existing SVG if any
            nodeGroup.select("svg").remove();

            // Adjust SVG properties and append to the group
            const newSvg = nodeGroup
                .append(() => svgElement)
                .attr("width", newRadius * 2)
                .attr("height", newRadius * 2)
                .attr("x", -newRadius) // Center the SVG horizontally
                .attr("y", -newRadius); // Center the SVG vertically

            // Adjust paths within the SVG
            newSvg.selectAll("path").attr("stroke", determineNodeColor(d));
        }
    });
}

function getNewRadius(nodeType, radius) {
    const radiusMap = {
        default: 1,
        company: 15 / 20,
        event: 18 / 20,
        location: 23 / 20,
        movement: 14 / 20,
        organization: 18 / 20,
        person: 18 / 20,
        political_organization: 15 / 20,
        vessel: 18 / 20,
    };

    return radius * (radiusMap[nodeType] || radiusMap["default"]);
}

function createNodes(
    nodes,
    targetsPerSourceCount,
    sourcesPerTargetCount,
    simulation
) {
    const nodeGroups = svg.selectAll("g.node").data(nodes, (d) => d.id);
    nodeGroups.exit().remove();

    // Enter selection for new groups
    const enteredNodeGroups = nodeGroups
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("id", (d) => `node-${d.id}`)
        .call(
            d3
                .drag()
                .on("start", (event, d) => dragstarted(event, d, simulation))
                .on("drag", dragged)
                .on("end", (event, d) => dragended(event, d, simulation))
        )
        .on("click", handleClick)
        .on("contextmenu", (event, d) => {
            event.preventDefault();
            showContextMenu(event, d);
        });

    // Append circles and SVG icons
    appendCircles(
        enteredNodeGroups,
        nodes,
        targetsPerSourceCount,
        sourcesPerTargetCount
    );
    appendSVGIcons(
        enteredNodeGroups,
        nodes,
        targetsPerSourceCount,
        sourcesPerTargetCount
    );

    // Merge entered groups with existing ones
    nodeGroups.merge(enteredNodeGroups);
}

function createLinks(links) {
    getTypesOfLinks().forEach((typeOfLink) => {
        const linkSelection = svg
            .selectAll(`path.link.${typeOfLink}`)
            .data(links.filter((d) => d.typeOfLink === typeOfLink));

        linkSelection
            .enter()
            .append("path")
            .attr("class", `link ${typeOfLink}`)
            .attr(
                "id",
                (d) => `link-${d.source.id}-${d.target.id}-${typeOfLink}`
            )
            .style("stroke", colorsOfLinks(typeOfLink) || "black")
            .style(
                "stroke-width",
                (d) => Math.sqrt(d.weight) * linksSizeMultiplier
            )
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

    let radius =
        Math.sqrt(targetsPerSourceCount[d.id] + sourcesPerTargetCount[d.id]) *
        3;
    //return 1
    return radius === 0 ? 1 : radius;
}

function createMarkers() {
    // Create the markers at the end
    svg.append("defs")
        .selectAll("marker")
        .data(getTypesOfLinks())
        .enter()
        .append("marker")
        .attr("id", (d) => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", markersRefX)
        .attr("refY", markersRefY)
        .attr("fill", (d) => colorsOfLinks(d))
        .attr("markerWidth", markerWidth)
        .attr("markerHeight", markerHeight)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowhead");
}

function createLabels(nodes, targetsPerSourceCount, sourcesPerTargetCount) {
    svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", (d) => d.type)
        .text((d) => {
            const radius = calculateRadius(
                d,
                targetsPerSourceCount,
                sourcesPerTargetCount
            );
            return radius > labelsNodeMinRadiusToShowLabel ? d.id : "";
        })
        .style("font-size", labelsFontSize)
        .style("fill", labelsColor)
        .style("text-anchor", "middle")
        .style("user-select", "none")
        .style("pointer-events", "none");
}

function setupTooltip(targetsPerSourceCount, sourcesPerTargetCount) {
    const tooltip = d3
        .select("body")
        .append("div-tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", tooltipBackgroundColor)
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "3px")
        .style("pointer-events", "none");

    svg.selectAll("g.node")
        .on("mouseover", (event, d) => {
            const nodeType =
                typeof d.nodeType === "object"
                    ? d.nodeType?.nodeType || "Unknown"
                    : d.nodeType || "Unknown";
            const country = d.country || "Unknown";

            tooltip.transition().duration(0).style("opacity", 1);
            tooltip
                .html(
                    `
                <div>${d.id}</div>
                <div>Node type: ${nodeType}</div>
                <div>Country: ${country}</div>
                <div>N. sources: ${
                    companiesToInvestigate.includes(d.id)
                        ? sourcesPerTargetCount[d.id] -
                          (companiesToInvestigate.length - 1)
                        : sourcesPerTargetCount[d.id]
                }</div>
                <div>N. targets: ${
                    companiesToInvestigate.includes(d.id)
                        ? targetsPerSourceCount[d.id] -
                          (companiesToInvestigate.length - 1)
                        : targetsPerSourceCount[d.id]
                }</div>
            `
                )
                .style("left", event.pageX + 5 + "px")
                .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () => {
            tooltip.transition().duration(0).style("opacity", 0);
        });
}

export {
    svgCache,
    preloadSvgs,
    createLabels,
    createLinks,
    createMarkers,
    createNodes,
    setupTooltip,
};
