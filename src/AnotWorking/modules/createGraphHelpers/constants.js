const graphDimensionsBorder = 25

const sourceAndTargetColor = '#04820f' //green
const sourceColor = '#821304' //red
const targetColor = '#042882' //blue
const blackColor = '#000' //black

const markersRefX = 8
const markersRefY = 0
const markerWidth = 3
const markerHeight = 3

const linksSizeMultiplier = 3

const labelsColor = '#000'
const labelsFontSize = '10px'
const labelsNodeMinRadiusToShowLabel = 10

const tooltipBackgroundColor = "#fff"

function determineNodeColor(node) {
    let color = blackColor

    if (node.type === 'source') {
        color = node.alsoTarget ? sourceAndTargetColor : sourceColor;
    }
    else {
        color = node.alsoSource ? sourceAndTargetColor : targetColor;
    }

    return color;
}

export {
    graphDimensionsBorder,
    sourceAndTargetColor, sourceColor, targetColor, blackColor,
    markersRefX, markersRefY, markerWidth, markerHeight,
    linksSizeMultiplier, labelsColor, labelsFontSize, labelsNodeMinRadiusToShowLabel,
    tooltipBackgroundColor,

    determineNodeColor
}