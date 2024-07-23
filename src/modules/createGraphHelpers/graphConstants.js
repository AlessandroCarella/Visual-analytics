import { companiesToInvestigate } from "../constants"
import { clickableNode } from "../dataManagement"

const clickableNodeColor = '#FFEA00' //yellow
const sourceAndTargetColor = '#04820f' //green
const sourceColor = '#821304' //red
const targetColor = '#042882' //blue
const blackColor = '#000' //black
const entityToInvestigateColor = '#54119c'

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
    null: '#000000',         // Black
    'company': '#0000FF',      // Blue
    'event': '#00FF00',        // Green
    'location': '#FF0000',     // Red
    'movement': '#FFA500',     // Orange
    'organization': '#800080', // Purple
    'person': '#00FFFF',       // Cyan
    'political_organization': '#FF00FF', // Magenta
    'vessel': '#8B4513'        // Brown
};


function determineNodeColor(node) {
    let color = blackColor

    if (companiesToInvestigate.includes(node.id)) {
        return entityToInvestigateColor;
    }

    if (clickableNode(node)){
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

export {
    sourceAndTargetColor, sourceColor, targetColor, blackColor, entityToInvestigateColor,
    markersRefX, markersRefY, markerWidth, markerHeight,
    linksSizeMultiplier, labelsColor, labelsFontSize, labelsNodeMinRadiusToShowLabel,
    tooltipBackgroundColor,
    determineNodeColor, determineNodeBorderColor, nodeBorderSize
};
