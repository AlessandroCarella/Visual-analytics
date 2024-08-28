import { companiesToInvestigate } from "../constants"
import { clickableNode } from "../dataManagement"

const lastAddedNodeColor = '#FF0000' //light red
const entityToInvestigateColor = '#54119c'//purple
const clickableNodeColor = '#FFEA00' //yellow
const sourceAndTargetColor = '#04820f' //green
const sourceColor = '#821304' //red
const targetColor = '#042882' //blue
const blackColor = '#000' //black

const nodeStateColor = {
    'Entity to investigate': entityToInvestigateColor, // Purple
    'Clickable node': clickableNodeColor, // Yellow
    'Source and target': sourceAndTargetColor, // Green
    'Source': sourceColor, // Red
    'Target': targetColor, // Blue
    'Last added node': lastAddedNodeColor, // Light Red
}

const markersRefX = 9
const markersRefY = 0
const markerWidth = 3
const markerHeight = 3

const linksSizeMultiplier = 3

const labelsColor = '#000' //black
const labelsFontSize = '10px'
const labelsNodeMinRadiusToShowLabel = 10

const tooltipBackgroundColor = "#fff"//white

const nodeBorderSize = 2;
const nodeTypeColor = {
    null: '#808080',         // Grey
    'company': '#0000FF',      // Blue
    'event': '#00FF00',        // Green
    'location': '#FF0000',     // Red
    'movement': '#FFA500',     // Orange
    'organization': '#800080', // Purple
    'person': '#00FFFF',       // Cyan
    'political_organization': '#FF00FF', // Magenta
    'vessel': '#8B4513'        // Brown
};

const defaultNodeOpacity = 1;
let nonHighlightedNodeOpacity = 0.1;

function setNonHighlightedNodeOpacity(value) {
    nonHighlightedNodeOpacity = value;
    // You might want to trigger a re-render of the graph here
    // or use an observer pattern to notify components that use this value
}

function getNonHighlightedNodeOpacity() {
    return nonHighlightedNodeOpacity;
}

const svgSize = 20; // Size of the SVG icons

function determineNodeColor(node) {
    let color = blackColor

    if (companiesToInvestigate.includes(node.id)) {
        return entityToInvestigateColor;
    }

    // if (node.id === getLastAddedNodeId()) {
    //     return lastAddedNodeColor;
    // }

    if (clickableNode(node)) {
        return clickableNodeColor;
    }

    if (node.type === 'source') {
        color = node.alsoTarget ? sourceAndTargetColor : sourceColor;
    }
    else {
        color = node.alsoSource ? sourceAndTargetColor : targetColor;
    }

    return color;
}

function determineNodeBorderColor(node) {
    return nodeTypeColor[node.nodeType]
}

export { setNonHighlightedNodeOpacity, getNonHighlightedNodeOpacity, defaultNodeOpacity, nonHighlightedNodeOpacity, blackColor, determineNodeBorderColor, determineNodeColor, entityToInvestigateColor, labelsColor, labelsFontSize, labelsNodeMinRadiusToShowLabel, linksSizeMultiplier, markerHeight, markersRefX, markersRefY, markerWidth, nodeBorderSize, nodeStateColor, nodeTypeColor, sourceAndTargetColor, sourceColor, svgSize, targetColor, tooltipBackgroundColor }
