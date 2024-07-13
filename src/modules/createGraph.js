import * as d3 from "d3";
import { types, svg, color } from "../index";

function createGraph(data) {
    const activeData = data.filter(d => types.includes(d.type));

    const activeSources = new Set(activeData.map(d => d.source));
    const activeTargets = new Set(activeData.map(d => d.target));

    // Calculate the number of targets each source has
    const sourceTargetCounts = findNumberOfTargets(activeData);
 
    createLinks(activeData);
    createNodes(activeData, 'source', '#216b44', activeSources, sourceTargetCounts);
    createNodes(activeData, 'target', '#c3c90e', activeTargets);
    createLabels(activeData, 'source', activeSources, sourceTargetCounts);
    createLabels(activeData, 'target', activeTargets);
}

function findNumberOfTargets(activeData) {
    const sourceTargetCounts = {}
    
    // Calculate the number of targets each source has
    activeData.forEach(d => {
        if (!sourceTargetCounts[d.source]) {
            sourceTargetCounts[d.source] = 0;
        }
        sourceTargetCounts[d.source]++;
    });

    return sourceTargetCounts;
}

function createLinks(data) {
    types.forEach(type => {
        svg.selectAll(`line.link.${type}`)
            .data(data.filter(d => d.type === type))
            .enter().append('line')
            .attr('x1', d => d.sourceX)
            .attr('y1', d => d.sourceY)
            .attr('x2', d => d.targetX)
            .attr('y2', d => d.targetY)
            .attr('class', `link ${type}`)
            .style('stroke', color(type))
            .style('stroke-width', d => Math.sqrt(d.weight) * 3)
            .each(function (d) {
                d.initialColor = color(d.type);
            });
    });
}

function createNodes(data, className, fillColor, activeNodes, sourceTargetCounts = {}) {
    svg.selectAll(`circle.${className}`)
        .data(data.filter(d => activeNodes.has(d[className])))
        .enter().append('circle')
        .attr('class', className)
        .attr('cx', d => d[`${className}X`])
        .attr('cy', d => d[`${className}Y`])
        .attr('r', d => className === 'source' ? Math.sqrt(sourceTargetCounts[d.source] || 1) * 5 : 6) // Adjust radius based on the count
        .style('fill', fillColor)
        .style('stroke', '#000')
        .style('stroke-width', 1);
}

function createLabels(data, className, activeNodes, sourceTargetCounts = {}) {
    svg.selectAll(`text.${className}`)
        .data(data.filter(d => activeNodes.has(d[className])))
        .enter().append('text')
        .attr('class', className)
        .attr('x', d => d[`${className}X`])
        .attr('y', d => d[`${className}Y`] + 4)
        .text(d => {
            const radius = className === 'source' ? Math.sqrt(sourceTargetCounts[d.source] || 1) * 5 : 6;
            return radius > 10 ? d[className] : '';
        })
        .style('font-size', '10px')
        .style('fill', '#000')
        .style('text-anchor', 'middle');
}

export { createGraph }