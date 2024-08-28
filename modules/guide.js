// modules/guide.js
import { typesOfLinks, colorsOfLinksVals } from "./constants";
import { svgCache } from "./createGraphHelpers/createEntities";
import { nodeStateColor, nodeTypeColor } from "./createGraphHelpers/graphConstants";

function setupGuideButton() {
    const showGuideButton = document.querySelector('.show-guide-button');
    const hideGuideButton = document.querySelector('.hide-guide-button');
    const guideColumn = document.querySelector('.guide-column');

    showGuideButton.addEventListener('click', () => {
        showGuideColumn(guideColumn, showGuideButton);
    });

    hideGuideButton.addEventListener('click', () => {
        hideGuideColumn(guideColumn, showGuideButton);
    });
}

function showGuideColumn(guideColumn, showGuideButton) {
    guideColumn.style.display = 'block';
    showGuideButton.style.display = 'none'; // Hide the show guide button
    populateGuideContent(); // Populate content dynamically
}

function hideGuideColumn(guideColumn, showGuideButton) {
    guideColumn.style.display = 'none';
    showGuideButton.style.display = 'block'; // Show the show guide button
}

function populateGuideContent() {
    const linksColorsSection = document.getElementById('links-colors-section');
    const nodesColorsSection = document.getElementById('nodes-colors-section');

    populateLinksColors(linksColorsSection);
    populateNodesColors(nodesColorsSection);
}

function populateLinksColors(section) {
    section.innerHTML = ''; // Clear previous content
    for (let nodeType in nodeTypeColor){
        const formattedType = formatLabel(nodeType);
        const colorDiv = createSvgDiv(nodeType === 'null' ? svgCache['Unknown'] : svgCache[nodeType], formattedType);
        section.appendChild(colorDiv);
    }
}

function populateNodesColors(section) {
    section.innerHTML = ''; // Clear previous content
    for (const [nodeType, color] of Object.entries(nodeStateColor)) {
        const formattedType = formatLabel(nodeType);
        const colorDiv = createColorDiv(color, formattedType);
        section.appendChild(colorDiv);
    }
}

function createSvgDiv(svgContent, label) {
    const svgDiv = document.createElement('div');
    svgDiv.classList.add('svg-section-item');
    svgDiv.innerHTML = `
        <div class="svg-square">${svgContent}</div>
        <div class="svg-label">${label}</div>
    `;
    return svgDiv;
}

function createColorDiv(color, label) {
    const colorDiv = document.createElement('div');
    colorDiv.classList.add('color-section-item');
    colorDiv.innerHTML = `
        <div class="color-square" style="background-color: ${color}"></div>
        <div class="color-label">${label}</div>
    `;
    return colorDiv;
}

function formatLabel(label) {
    // Replace underscores with spaces and 'null' with 'Unknown'
    return label.replace(/_/g, ' ').replace('null', 'Unknown');
}

export { setupGuideButton };
