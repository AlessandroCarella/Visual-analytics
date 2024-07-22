import { companiesToInvestigate } from "../constants"
import { getInitialLinksData, getSourcesPerTargetCountVal, getTargetsPerSourceCountVal } from "../dataManagement"

const graphDimensionsBorder = 25

const expandableNodeColor = '#FFEA00' //yellow
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
    if (companiesToInvestigate.includes(node.id)) {
        return entityToInvestigateColor;
    }

    //TODO replace with the count of its targets and sources and the count of the links the node is in 
    //count of sources + count of targets === number of links the node is in

    console.log("initial links", getInitialLinksData())
    let filteredLinks = Array.from(getInitialLinksData()).filter(link => {
        return (link.source.id === node.id || link.target.id === node.id)
    })
    console.log("TargetsPerSourceCountVal", getTargetsPerSourceCountVal(node.id))
    console.log("SourcesPerTargetCountVal", getSourcesPerTargetCountVal(node.id))
    console.log("filteredLinks.length", filteredLinks.length)
    if ((getTargetsPerSourceCountVal(node.id) + getSourcesPerTargetCountVal(node.id)) === filteredLinks.length) {
        return expandableNodeColor;
    }
    //else the node is fully expanded

    if (node.type === 'source') {
        return sourceColor;
    }

    if (node.type === 'target') {
        return targetColor;
    }

    return blackColor;
}

function determineNodeBorderColor(node) {
    return nodeTypeColor[node.nodeType]
}

export {
    graphDimensionsBorder,
    markersRefX, markersRefY, markerWidth, markerHeight,
    linksSizeMultiplier, labelsColor, labelsFontSize, labelsNodeMinRadiusToShowLabel,
    tooltipBackgroundColor,
    determineNodeColor, determineNodeBorderColor, nodeBorderSize
};
