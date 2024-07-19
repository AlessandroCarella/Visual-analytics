import { None } from "vega"

const graphDimensionsBorder = 25

const sourceAndTargetColor = '#04820f' //green
const targetAndSourceColor = '#FFEA00' //yellow
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
    
    if (node.type === 'source') {
        color = node.alsoTarget ? sourceAndTargetColor : sourceColor;
    }
    else {
        color = node.alsoSource ? targetAndSourceColor : targetColor;
    }

    return color;
}

function determineNodeBorderColor(node){
    console.log(node.nodeType)
     
    return nodeTypeColor[node.nodeType]
}

export {
    graphDimensionsBorder,
    sourceAndTargetColor, sourceColor, targetColor, blackColor,
    markersRefX, markersRefY, markerWidth, markerHeight,
    linksSizeMultiplier, labelsColor, labelsFontSize, labelsNodeMinRadiusToShowLabel,
    tooltipBackgroundColor,
    determineNodeColor, determineNodeBorderColor, nodeBorderSize
}