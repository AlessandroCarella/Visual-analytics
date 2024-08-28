import * as d3 from "d3";
import { svg } from "../../index";
import { linkToInvestigateTag } from "../constants";
import { defaultNodeOpacity, determineNodeColor, nodeBorderSize, nonHighlightedNodeOpacity } from "./graphConstants";
import { getCurrentData } from "../dataManagement";

function removeHighlightCircles() {
    svg.selectAll("circle.highlight").remove();
}

function resetHighlights() {
    function resetNodeStyles() {
        svg.selectAll("g.node")
            .style("opacity", defaultNodeOpacity)
            .select("circle")
            .style("stroke", (d) => determineNodeColor(d))
            .style("stroke-width", nodeBorderSize);
    }

    function resetLinkOpacity() {
        svg.selectAll("path.link").style("opacity", defaultNodeOpacity);
    }

    removeHighlightCircles();
    resetNodeStyles();
    resetLinkOpacity();
}

function findConnectedNodes(d) {
    const connectedNodes = new Set();
    getCurrentData().forEach((link) => {
        if (link.typeOfLink !== linkToInvestigateTag) {
            if (link.source === d.id) connectedNodes.add(link.target);
            if (link.target === d.id) connectedNodes.add(link.source);
        }
    });
    return connectedNodes;
}

function highlightConnectedNodes(d, connectedNodes) {
    function addHighlightCircles(d, connectedNodes) {
        svg.selectAll("g.node")
            .filter((node) => connectedNodes.has(node.id) || node.id === d.id)
            .append("circle")
            .attr("class", "highlight")
            .attr("r", (node) => node.radius + nodeBorderSize + 0.1) // 0.1 is an added distance so that the internal border is still well showed
            .style("fill", "none")
            .style("stroke", "red")
            .style("stroke-width", "3px");
    }

    function updateNodeOpacity(d, connectedNodes) {
        svg.selectAll("g.node").style("opacity", (node) =>
            connectedNodes.has(node.id) || node.id === d.id
                ? defaultNodeOpacity
                : nonHighlightedNodeOpacity
        );
    }

    function updateLinkOpacity(d, connectedNodes) {
        svg.selectAll("path.link").style("opacity", (link) =>
            (connectedNodes.has(link.source.id) || link.source.id === d.id) &&
            (connectedNodes.has(link.target.id) || link.target.id === d.id)
                ? defaultNodeOpacity
                : nonHighlightedNodeOpacity
        );
    }

    removeHighlightCircles();
    addHighlightCircles(d, connectedNodes);
    updateNodeOpacity(d, connectedNodes);
    updateLinkOpacity(d, connectedNodes);
}

export { resetHighlights, highlightConnectedNodes, findConnectedNodes};

