const graphDimensionsBorder = 25

const activeButtonClass = "active-button"
const inactiveButtonClass = "inactive-button"

const typesOfLinks = ["ownership", "partnership", "family_relationship", "membership", "toInvestigate"];
const colorsOfLinksVals = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "black"]
const colorsOfLinks = d3.scaleOrdinal()
    .domain(typesOfLinks)
    .range(colorsOfLinksVals);


const sourceSelectTag = `#source-select`;
const targetSelectTag = `#target-select`;

const selectDefaultValue = 'all';
const selectDefaultValueText = 'All'

const companiesToInvestigate = [
    "Mar de la Vida OJSC",
    "979893388",
    "Oceanfront Oasis Inc Carriers",
    "8327"
]
const companiesToInvestigateExtraInfo = {
    "Mar de la Vida OJSC": { nodeType: null, country: null },
    "979893388": { nodeType: "organization", country: null },
    "Oceanfront Oasis Inc Carrie": { nodeType: null, country: null },
    "8327": { nodeType: "organization", country: null }
}
const companiesToInvestigateTypeOfLink = "toInvestigate";

const companiesToInvestigateSelectVal = companiesToInvestigate.join(" ");
const companiesToInvestigateText = "Entities to investigate"

export {
    graphDimensionsBorder,
    activeButtonClass, inactiveButtonClass,
    typesOfLinks, colorsOfLinks,
    sourceSelectTag, targetSelectTag,
    selectDefaultValue, selectDefaultValueText,
    companiesToInvestigate, companiesToInvestigateExtraInfo,
    companiesToInvestigateSelectVal, companiesToInvestigateText, companiesToInvestigateTypeOfLink,
};
