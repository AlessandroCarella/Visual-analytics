import * as d3 from "d3";
import { types, svg, color } from "../index";
import { findNumberOfTargets, cleanSet } from "./utils";

function createGraph(data) {
    const activeData = data.filter(d => types.includes(d.type));

    var activeSources = Array.from(new Set(activeData.map(d => d.source)));
    var activeTargets = Array.from(new Set(activeData.map(d => d.target)));
    activeTargets = cleanSet(activeTargets, activeSources);

    const sourceTargetCounts = findNumberOfTargets(data);

    const nodes = activeSources.map(source => ({ id: source, type: 'source' }))
        .concat(activeTargets.map(target => ({ id: target, type: 'target' })));

    const links = activeData.map(d => ({
        source: nodes.find(node => node.id === d.source),
        target: nodes.find(node => node.id === d.target),
        type: d.type,
        weight: d.weight
    }));

    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink().id(d => d.id).links(links).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', ticked);

    createLinks(links);
    createNodes(nodes, sourceTargetCounts);
    createLabels(nodes, sourceTargetCounts);
    setupTooltip();

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
        svg.append("defs").selectAll("marker")
            .data(types)
            .enter().append("marker")
            .attr("id", d => `arrow-${d}`)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", 0)
            .attr("fill", d => color(d))
            .attr("markerWidth", 3)
            .attr("markerHeight", 3)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("class", "arrowhead");

        types.forEach(type => {
            svg.selectAll(`line.link.${type}`)
                .data(links.filter(d => d.type === type))
                .enter().append('line')
                .attr('class', `link ${type}`)
                .style('stroke', color(type))
                .style('stroke-width', d => Math.sqrt(d.weight) * 3)
                .attr("marker-end", `url(#arrow-${type})`)
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
            .style('user-select', 'none')
            .style('pointer-events', 'none');
    }

    function setupTooltip() {
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "#fff")
            .style("border", "1px solid #ccc")
            .style("padding", "5px")
            .style("border-radius", "3px");

        svg.selectAll('circle')
            .on('mouseover', (event, d) => {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(d.id)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on('mouseout', () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }
}

export { createGraph }
