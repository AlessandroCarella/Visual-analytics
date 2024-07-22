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

export { getGraphDimensions, getUniqueItemsPerKey, isObjectEmpty, removeDuplicatesBetweenSet1AndSet2 };
