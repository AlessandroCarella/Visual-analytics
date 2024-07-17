import { getCurrentData, getInitalData } from './dataManagement';

function getUniqueItemsPerKey(key) {
    return Array.from(new Set(getInitalData().map(d => d[key])));
}

function removeDuplicatesBetweenSet1AndSet2(setToClean, setTwo) {
    setToClean.forEach(elem => {
        if (setTwo.has(elem)) {
            setToClean.delete(elem);
        }
    });

    return Array.from(setToClean);
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

export { getUniqueItemsPerKey, removeDuplicatesBetweenSet1AndSet2, isObjectEmpty, getGraphDimensions, findPerSourceNumberOfTargets }
