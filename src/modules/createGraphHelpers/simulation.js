
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
        .attr('x1', d => {
            try {
                const x1 = getIntersectionX(d.source, d.target, true);
                if (isNaN(x1)) throw new Error('x1 is NaN');
                return x1;
            } catch (error) {
                console.error('Error setting x1 attribute for line.link:', error);
                console.error('Data causing error:', d);
                return 0; // Or some default value
            }
        })
        .attr('y1', d => {
            try {
                const y1 = getIntersectionY(d.source, d.target, true);
                if (isNaN(y1)) throw new Error('y1 is NaN');
                return y1;
            } catch (error) {
                console.error('Error setting y1 attribute for line.link:', error);
                console.error('Data causing error:', d);
                return 0; // Or some default value
            }
        })
        .attr('x2', d => {
            try {
                const x2 = getIntersectionX(d.target, d.source, false);
                if (isNaN(x2)) throw new Error('x2 is NaN');
                return x2;
            } catch (error) {
                console.error('Error setting x2 attribute for line.link:', error);
                console.error('Data causing error:', d);
                return 0; // Or some default value
            }
        })
        .attr('y2', d => {
            try {
                const y2 = getIntersectionY(d.target, d.source, false);
                if (isNaN(y2)) throw new Error('y2 is NaN');
                return y2;
            } catch (error) {
                console.error('Error setting y2 attribute for line.link:', error);
                console.error('Data causing error:', d);
                return 0; // Or some default value
            }
        });

    svg.selectAll('circle')
        .attr('cx', d => {
            try {
                d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
                return d.x;
            } catch (error) {
                console.error('Error setting cx attribute for circle:', error);
                console.error('Data causing error:', d);
                return 0; // Or some default value
            }
        })
        .attr('cy', d => {
            try {
                d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
                return d.y;
            } catch (error) {
                console.error('Error setting cy attribute for circle:', error);
                console.error('Data causing error:', d);
                return 0; // Or some default value
            }
        });

    svg.selectAll('text')
        .attr('x', d => {
            try {
                return d.x;
            } catch (error) {
                console.error('Error setting x attribute for text:', error);
                console.error('Data causing error:', d);
                return 0; // Or some default value
            }
        })
        .attr('y', d => {
            try {
                return d.y + 4;
            } catch (error) {
                console.error('Error setting y attribute for text:', error);
                console.error('Data causing error:', d);
                return 0; // Or some default value
            }
        });
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