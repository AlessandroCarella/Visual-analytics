import * as d3 from "d3";
import { types, svg, color } from "../index";
import { findNumberOfTargets } from "./utils";

function createGraph(data) {
    const activeData = data.filter(d => types.includes(d.type));

    const activeSources = new Set(activeData.map(d => d.source));
    const activeTargets = new Set(activeData.map(d => d.target));

    // Calculate the number of targets each source has
    const sourceTargetCounts = findNumberOfTargets(data);

    const nodes = Array.from(activeSources).map(source => ({ id: source, type: 'source' }))
        .concat(Array.from(activeTargets).map(target => ({ id: target, type: 'target' })));

    const links = activeData.map(d => ({
        source: d.source,
        target: d.target,
        type: d.type,
        weight: d.weight
    }));

    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', ticked);

    createLinks(links);
    createNodes(nodes, sourceTargetCounts);
    createLabels(nodes, sourceTargetCounts);

    function ticked() {
        svg.selectAll('line.link')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

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

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function createLinks(links) {
        types.forEach(type => {
            svg.selectAll(`line.link.${type}`)
                .data(links.filter(d => d.type === type))
                .enter().append('line')
                .attr('class', `link ${type}`)
                .style('stroke', color(type))
                .style('stroke-width', d => Math.sqrt(d.weight) * 3)
                .each(function (d) {
                    d.initialColor = color(d.type);
                });
        });
    }

    function createNodes(nodes, sourceTargetCounts) {
        svg.selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('class', d => d.type)
            .attr('r', d => {
                d.radius = d.type === 'source' ? Math.sqrt(sourceTargetCounts[d.id] || 1) * 5 : 6;
                return d.radius;
            })
            .style('fill', d => d.type === 'source' ? '#216b44' : '#c3c90e')
            .style('stroke', '#000')
            .style('stroke-width', 1)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));
    }

    function createLabels(nodes, sourceTargetCounts) {
        svg.selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('class', d => d.type)
            .text(d => {
                const radius = d.type === 'source' ? Math.sqrt(sourceTargetCounts[d.id] || 1) * 5 : 6;
                return radius > 10 ? d.id : '';
            })
            .style('font-size', '10px')
            .style('fill', '#000')
            .style('text-anchor', 'middle')
            .style('user-select', 'none')  // Prevent text selection
            .style('pointer-events', 'none');  // Prevent pointer events on text
    }
    
}

export { createGraph }
