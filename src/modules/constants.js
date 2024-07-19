const graphDimensionsBorder = 25

const activeButtonClass = "active-button"
const inactiveButtonClass = "inactive-button"

const typesOfLinks = ["ownership", "partnership", "family_relationship", "membership"];
const colorsOfLinksVals = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]
const colorsOfLinks = d3.scaleOrdinal()
    .domain(typesOfLinks)
    .range(colorsOfLinksVals);

export {
    graphDimensionsBorder,
    activeButtonClass, inactiveButtonClass,
    typesOfLinks, colorsOfLinks
}