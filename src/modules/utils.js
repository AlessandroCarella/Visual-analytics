import { graphDimensionsBorder } from './createGraphHelpers/constants'

function getUniqueItems(data, key) {
    return Array.from(new Set(data.map(d => d[key])));
}

function removeDuplicates (arrayToClean, arrayTwo){
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
function findNumberOfTargets(data) {
    const sourceTargetCounts = {};

    // Calculate the number of targets each source has
    data.forEach(d => {
        if (!sourceTargetCounts[d.source]) {
            sourceTargetCounts[d.source] = 0;
        }
        sourceTargetCounts[d.source]++;
    });

    return sourceTargetCounts;
}

export { getUniqueItems, removeDuplicates, isObjectEmpty, getGraphDimensions, findNumberOfTargets }
