import { companiesToInvestigate } from "../constants"
import { clickableNode, getLastAddedNodeId } from "../dataManagement"

const lastAddedNodeColor = '#FF0000' //light red
const entityToInvestigateColor = '#54119c'//purple
const clickableNodeColor = '#FFEA00' //yellow
const sourceAndTargetColor = '#04820f' //green
const sourceColor = '#821304' //red
const targetColor = '#042882' //blue
const blackColor = '#000' //black

const markersRefX = 8
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

const svgSize = 20; // Size of the SVG icons

function determineNodeColor(node) {
    let color = blackColor

    if (companiesToInvestigate.includes(node.id)) {
        console.log (entityToInvestigateColor)
        return entityToInvestigateColor;
    }

    if (node.id === getLastAddedNodeId()) {
        console.log (lastAddedNodeColor)
        return lastAddedNodeColor;
    }

    if (clickableNode(node)) {
        console.log (clickableNodeColor)
        return clickableNodeColor;
    }

    if (node.type === 'source') {
        color = node.alsoTarget ? sourceAndTargetColor : sourceColor;
    }
    else {
        color = node.alsoSource ? sourceAndTargetColor : targetColor;
    }
    console.log (color)

    return color;
}

function determineNodeBorderColor(node) {
    return nodeTypeColor[node.nodeType]
}

export { svgSize, blackColor, nodeTypeColor, determineNodeBorderColor, determineNodeColor, entityToInvestigateColor, labelsColor, labelsFontSize, labelsNodeMinRadiusToShowLabel, linksSizeMultiplier, markerHeight, markersRefX, markersRefY, markerWidth, nodeBorderSize, sourceAndTargetColor, sourceColor, targetColor, tooltipBackgroundColor }
