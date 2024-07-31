import * as d3 from 'd3';

// Angle map for different numbers of links
// Angle map for different numbers of links
const angleMap = {
    2: [Math.PI / 6, -Math.PI / 6], // Same angle, opposite direction
    3: [Math.PI / 6, 0, -Math.PI / 6], // Same as 2, plus straight in the middle
    4: [Math.PI / 6, Math.PI / 3, -Math.PI / 3, -Math.PI / 6] // Two pairs of opposite angles with larger angles
};

// Calculate the distance between source and target nodes
function calculateDistance(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
}

// Calculate the angle of the link direction
function calculateAngle(dy, dx) {
    return Math.atan2(dy, dx);
}

// Calculate the position on the node border for the link
function calculateNodeBorderPosition(x, y, angle, radius) {
    return {
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius
    };
}

// Check if a straight line should be drawn
function shouldDrawStraightLine(d) {
    return (
        d.nMultipleLinks === 1 ||
        d.typeOfLink === linkToInvestigateTag ||
        (d.nMultipleLinks === 2 && Object.values(d.multipleLinks).some(value => value === 2))
    );
}

// Get the specific angle for this link
function getArcAngle(linkCount, typeIndex) {
    const angleList = angleMap[linkCount] || [Math.PI / 3, -Math.PI / 3]; // Default angles if not specified in angleMap
    return angleList[typeIndex] || 0; // Default to 0 if not found
}

// Calculate the control points for the arc
function calculateControlPoints(sourceX, sourceY, targetX, targetY, controlAngle, controlPointDistance) {
    // Midpoint between source and target
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    // Control point offset from the midpoint
    const cx = midX + Math.cos(controlAngle) * controlPointDistance;
    const cy = midY + Math.sin(controlAngle) * controlPointDistance;

    return { cx, cy };
}


// Main linkArc function
function linkArc(d) {
    const dx = d.target.x - d.source.x;
    const dy = d.target.y - d.source.y;
    const distance = calculateDistance(dx, dy);
    const angle = calculateAngle(dy, dx);

    const sourceRadius = d.source.radius || 0;
    const targetRadius = d.target.radius || 0;

    // Calculate positions on the border of the source and target nodes
    const sourcePosition = calculateNodeBorderPosition(d.source.x, d.source.y, angle, sourceRadius);
    const targetPosition = calculateNodeBorderPosition(d.target.x, d.target.y, angle + Math.PI, targetRadius);

    const sourceX = sourcePosition.x;
    const sourceY = sourcePosition.y;
    const targetX = targetPosition.x;
    const targetY = targetPosition.y;

    if (shouldDrawStraightLine(d)) {
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    } else {
        const linkCount = Object.keys(d.multipleLinks).length;
        const typeIndex = Object.keys(d.multipleLinks).indexOf(d.typeOfLink); // Zero-based index
        const arcAngle = getArcAngle(linkCount, typeIndex);

        // Adjust control point calculation to ensure better angles
        const controlPointDistance = distance / 3; // Adjust fraction as needed
        const controlAngle = angle + arcAngle;

        const { cx, cy } = calculateControlPoints(sourceX, sourceY, targetX, targetY, controlAngle, controlPointDistance);

        return `M${sourceX},${sourceY}Q${cx},${cy} ${targetX},${targetY}`;
    }
}


function ticked(width, height, svg) {
    try {
        svg.selectAll('path.link')
            .attr('d', d => {
                    return linkArc(d);
            })
            .attr('fill', 'none');

        svg.selectAll('g.node')
            .attr('transform', d => {
                // Ensure nodes stay within the boundaries
                d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
                d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
                return `translate(${d.x},${d.y})`;
            });
    } catch (error) {
        console.error("Error in ticked function:", error);
    }
}



////////////////////////////////////////

import { svg } from '../../index';
import { getGraphDimensions } from '../utils';
import { linkToInvestigateTag } from '../constants';

// Define a function to set link distance based on link type
function linkDistance(d) {
    switch (d.typeOfLink) {
        case linkToInvestigateTag:
            return 500;
        default:
            return 100; // Default d3.js distance
    }
}

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
        .force('link', d3.forceLink(links).id(d => d.id).distance(linkDistance))
        .force('charge', d3.forceManyBody().strength(repulsionStrength))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', () => ticked(width, height, svg));
}

export { initializeSimulation };
