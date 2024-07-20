import { graphDimensionsBorder } from './constants';
import { getInitialData } from './dataManagement';
function getUniqueItemsPerKey(key) {
    //turned to set and back to array because i want the elements to be unique
    return Array.from(new Set(Array.from(getInitialData()).map(d => d[key])));
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

function findPerSourceNumberOfTargetsOrOpposite(data, type) {
    //find the number of targets for each source 
    //(or the number of sources for target based on the type passed)
    //example usages:
    //const targetsPerSourceCount = findPerSourceNumberOfTargetsOrOpposite(getCurrentData(), "source");
    //const sourcesPerTargetCount = findPerSourceNumberOfTargetsOrOpposite(getCurrentData(), "target");
    let result = {};

    data.forEach(d => {
        let key = type === 'source' ? d.source : d.target;

        if (!result[key]) {
            result[key] = 0;
        }
        result[key]++;
    });

    return result;
}

export { findPerSourceNumberOfTargetsOrOpposite, getGraphDimensions, getUniqueItemsPerKey, isObjectEmpty, removeDuplicatesBetweenSet1AndSet2 };
