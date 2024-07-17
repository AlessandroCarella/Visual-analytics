import { graphDimensionsBorder } from './createGraphHelpers/constants'
import { getCurrentData, getInitalData } from './dataManagement';

function getUniqueItems(key) {
    return Array.from(new Set(getInitalData().map(d => d[key])));
}

function removeDuplicates(arrayToClean, arrayTwo) {
    arrayToClean = new Set(arrayToClean);
    arrayTwo = new Set(arrayTwo);

    arrayToClean.forEach(elem => {
        if (arrayTwo.has(elem)) {
            arrayToClean.delete(elem);
        }
    });

    return Array.from(arrayToClean);
}

function isObjectEmpty(object) {
    for (const key in object) {
        return !object.hasOwnProperty(key);
    }
    return true;
}

function getGraphDimensions() {
    const { width, height } = document.querySelector('.graph').getBoundingClientRect();
    return { width: width - graphDimensionsBorder, height: height - graphDimensionsBorder };
}
function findPerSourceNumberOfTargets(data) {
    let perSourceNumberOfTargets = {};

    // Calculate the number of targets each source has
    data.forEach(d => {
        if (!perSourceNumberOfTargets[d.source]) {
            perSourceNumberOfTargets[d.source] = 0;
        }
        perSourceNumberOfTargets[d.source]++;
    });

    return perSourceNumberOfTargets;
}

export { getUniqueItems, removeDuplicates, isObjectEmpty, getGraphDimensions, findPerSourceNumberOfTargets }
