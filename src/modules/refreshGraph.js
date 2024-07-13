import * as d3 from "d3";
import { types, svg, color, activeButtons } from "../index"
import { findNumberOfTargets } from "./utils";

function refreshGraph(data) {
    const selectedSource = d3.select(`#source-select`).property('value');
    const selectedTarget = d3.select(`#target-select`).property('value');
    const activeTypes = Array.from(activeButtons);

    // Filter data based on selected source and/or target
    const filteredData = data.filter(d =>
        (d.source === selectedSource || selectedSource === 'all') &&
        (d.target === selectedTarget || selectedTarget === 'all')
    );

    const activeSources = new Set(filteredData.map(d => d.source));
    const activeTargets = new Set(filteredData.map(d => d.target));

    const sourceTargetCounts = findNumberOfTargets(data);

    hideAllGraphElements();

    if (selectedSource === 'All' && selectedTarget === 'All') {
        // Show all elements for active types
        refreshNodes(data, 'source', '#216b44', new Set(data.map(d => d.source)), sourceTargetCounts);
        refreshNodes(data, 'target', '#c3c90e', new Set(data.map(d => d.target)));
        refreshLabels(data, 'source', new Set(data.map(d => d.source)), sourceTargetCounts);
        refreshLabels(data, 'target', new Set(data.map(d => d.target)));
        refreshLinks(data, activeTypes, new Set(data.map(d => d.source)), new Set(data.map(d => d.target)));
    } else {
        refreshNodes(filteredData, 'source', '#216b44', activeSources, sourceTargetCounts);
        refreshNodes(filteredData, 'target', '#c3c90e', activeTargets);
        refreshLabels(filteredData, 'source', activeSources, sourceTargetCounts);
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

function refreshNodes(filteredData, className, fillColor, activeNodes, sourceTargetCounts={}) {
    console.log('refresh nodes');
    console.log(sourceTargetCounts);
    svg.selectAll(`circle.${className}`)
        .data(filteredData.filter(d => activeNodes.has(d[className])))
        .style('visibility', 'visible')  // Only show the filtered nodes
        .attr('cx', d => d[`${className}X`])
        .attr('cy', d => d[`${className}Y`])
        .attr('r', d => className === 'source' ? Math.sqrt(sourceTargetCounts[d.source] || 1) * 5 : 6) // Adjust radius based on the count
        .style('fill', fillColor)
        .style('stroke', '#000')
        .style('stroke-width', 1);
}

function refreshLabels(filteredData, className, activeNodes, sourceTargetCounts={}) {
    svg.selectAll(`text.${className}`)
        .data(filteredData.filter(d => activeNodes.has(d[className])))
        .style('visibility', 'visible')  // Only show the filtered labels
        .attr('x', d => d[`${className}X`] + 8)
        .attr('y', d => d[`${className}Y`] - 8)
        .text(d => {
            const radius = className === 'source' ? Math.sqrt(sourceTargetCounts[d.source] || 1) * 5 : 6;
            return radius > 10 ? d[className] : '';
        })        
        .style('font-size', '10px')
        .style('fill', '#000');
}

export { refreshGraph }

