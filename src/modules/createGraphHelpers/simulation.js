
function getIntersectionX(node1, node2, isSource) {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const r = node1.radius;

    const x = node1.x + (r / dist) * dx * (1);
    return x;
}

function getIntersectionY(node1, node2, isSource) {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const r = node1.radius;

    const y = node1.y + (r / dist) * dy * (1);
    return y;
}

function ticked(width, height, svg) {
    svg.selectAll('line.link')
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

////////////////////////////////////////

import { svg } from '../../index'
import { getGraphDimensions } from '../utils';

function initializeSimulation(nodes, links) {
    const { width, height } = getGraphDimensions();

    return d3.forceSimulation(nodes)
        .force('link', d3.forceLink().id(d => d.id).links(links).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', () => ticked(width, height, svg));
}

export { initializeSimulation }