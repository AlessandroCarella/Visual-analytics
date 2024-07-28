/*
//with errors statement
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
*/
import * as d3 from 'd3';

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

function linkArc(d) {
    let number = d3.randomInt(5);
    let dx = d.target.x - d.source.x
    let dy = d.target.y - d.source.y
    let r = 5
    
    if (number == 1) r = 60; // Add a fixed distance to separate the arcs
    
    return "M" + d.source.x + "," + d.source.y +
        "A" + r + "," + r + " 0 0,1 " + d.target.x + "," + d.target.y;
  }

function ticked(width, height, svg) {
    svg.selectAll('path.link')
        // .attr('x1', d => {
        //     const x1 = getIntersectionX(d.source, d.target, true);
        //     return isNaN(x1) ? 0 : x1;
        // })
        // .attr('y1', d => {
        //     const y1 = getIntersectionY(d.source, d.target, true);
        //     return isNaN(y1) ? 0 : y1;
        // })
        // .attr('x2', d => {
        //     const x2 = getIntersectionX(d.target, d.source, false);
        //     return isNaN(x2) ? 0 : x2;
        // })
        // .attr('y2', d => {
        //     const y2 = getIntersectionY(d.target, d.source, false);
        //     return isNaN(y2) ? 0 : y2;
        // })
        .attr('d', d=> linkArc(d))


    svg.selectAll('g.node')
        .attr('transform', d => {
            // Ensure nodes stay within the boundaries
            d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
            d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
            return `translate(${d.x},${d.y})`;
        });
        // .attr('cx', d => {
        //     d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
        //     return d.x;
        // })
        // .attr('cy', d => {
        //     d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
        //     return d.y;
        // });

    svg.selectAll('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4);
}


////////////////////////////////////////

import { svg } from '../../index';
import { getGraphDimensions } from '../utils';
import { svgSize } from './graphConstants';

function calculateRepulsionStrength(numNodes) {
    const baseStrength = -600; // Increase the base strength
    const scalingFactor = Math.log(numNodes + 1); // Use log scaling
    return baseStrength / scalingFactor;
}

function initializeSimulation(nodes, links) {
    const { width, height } = getGraphDimensions();
    const numNodes = nodes.length;
    const repulsionStrength = calculateRepulsionStrength(numNodes);

    return d3.forceSimulation(nodes)
        .force('link', d3.forceLink().id(d => d.id).links(links).distance(100))
        .force('charge', d3.forceManyBody().strength(repulsionStrength))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', () => ticked(width, height, svg));
}

export { initializeSimulation };

