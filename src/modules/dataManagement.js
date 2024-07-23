let initialData;
let currentData;
let addedNodes = new Set();

function getInitialData() {
    return initialData;
}

function setInitialData(data) {
    initialData = data;
}

function setCurrentData(data) {
    currentData = data;
}

function getCurrentData() {
    return currentData;
}

function getAddedNodes() {
    return addedNodes;
}

function addNodeToAddedNodes(node) {
    addedNodes.add(node);
}

function resetAddedNodes() {
    addedNodes.clear();
}

let relevantLinks;
function clickableNode(node) {
    let clickableNodeVar = false;

    if ((node.type === "target" && node.alsoSource) || (node.type === "source" && node.alsoTarget)) {
        relevantLinks = Array.from(initialData).filter(link => link.source === node.id || link.target === node.id);
    }else if (node.type === "source" && !node.alsoTarget) {
        relevantLinks = Array.from(initialData).filter(link => link.source === node.id);
    } else if (node.type === "target" && !node.alsoSource) {
        relevantLinks = Array.from(initialData).filter(link => link.target === node.id);
    }

    for (const link of relevantLinks) {
        if (!currentData.has(link) && getActiveButtons().has(link.typeOfLink)) {
            clickableNodeVar = true;
            break; // exit the loop
        }
    }

    return clickableNodeVar;
}

function updateCurrentDataWithNewNodes() {
    let dataToAdd = new Set();

    addedNodes.forEach(newNode => {
        if ((newNode.type === "target" && newNode.alsoSource) || (newNode.type === "source" && newNode.alsoTarget)) {
            relevantLinks = Array.from(initialData).filter(link => link.source === newNode.id || link.target === newNode.id);
        } else if (newNode.type === 'source' && !newNode.alsoTarget) {
            relevantLinks = Array.from(initialData).filter(link => link.source === newNode.id);
        } else if (newNode.type === 'target' && !newNode.alsoSource) {
            relevantLinks = Array.from(initialData).filter(link => link.target === newNode.id);
        }

        relevantLinks.forEach(link => {
            if (!currentData.has(link)) {
                dataToAdd.add(link);
            }
        });
    });

    setCurrentData(new Set([...currentData, ...dataToAdd]));
}


///////////////////////////////////////////

let allSources = new Set();
let allTargets = new Set();

function getAllSources() {
    if (allSources.length === 0 || typeof allSources.length === 'undefined') {
        allSources = new Set(Array.from(initialData).map(d => d.source));
    }
    return allSources;
}

function getAllTargets() {
    if (allTargets.length === 0 || typeof allTargets.length === 'undefined') {
        allTargets = new Set(Array.from(initialData).map(d => d.target));
    }
    return allTargets;
}

///////////////////////////////////////////

import { companiesToInvestigate, companiesToInvestigateSelectVal, selectAllNodesVal, typesOfLinks } from "./constants";

let activeButtons;

function getTypesOfLinks() {
    return typesOfLinks;
}

///////////////////////////////////////////

function createActiveButtons() {
    activeButtons = new Set(getTypesOfLinks());
}

function getActiveButtons() {
    return activeButtons;
}

function updateActiveButtons(element, addTrueDeleteFalse) {
    if (addTrueDeleteFalse) {
        activeButtons.add(element);
    } else {
        activeButtons.delete(element);
    }
}

function updateCurrentDataBasedOnButtons() {
    let newData = new Set();

    currentData.forEach(element => {
        if (activeButtons.has(element.typeOfLink)) {
            newData.add(element);
        }
    });

    setCurrentData(newData);
}

///////////////////////////////////////////

import { selectEmptyVal, sourceSelectTag, targetSelectTag } from './constants';
let selectedSource = selectEmptyVal;
let selectedTarget = selectEmptyVal;

function getSelectedSource() {
    return selectedSource;
}

function resetSelectedSource() {
    d3.select(sourceSelectTag).property('value', selectEmptyVal);
    selectedSource = selectEmptyVal;
}

function setSelectedSource(element) {
    resetAddedNodes();
    selectedSource = element;
}

////////////////////

function getSelectedTarget() {
    return selectedTarget;
}

function resetSelectedTarget() {
    d3.select(targetSelectTag).property('value', selectEmptyVal);
    selectedTarget = selectEmptyVal;
}

function setSelectedTarget(element) {
    resetAddedNodes();
    selectedTarget = element;
}

///////////////////

function updateCurrentDataBasedOnSelect() {
    let selectedValue = selectedSource !== selectEmptyVal ? selectedSource : selectedTarget;
    let selectedType = selectedSource !== selectEmptyVal ? 'source' : 'target';

    if (selectedSource === selectAllNodesVal || selectedTarget === selectAllNodesVal) {
        setCurrentData(initialData);
        return;
    }

    let newData = new Set();

    if (selectedValue === companiesToInvestigateSelectVal) {
        initialData.forEach(element => {
            if (companiesToInvestigate.includes(element[selectedType])) {
                newData.add(element);
            }
        });

        setCurrentData(newData);
        return;
    }

    initialData.forEach(element => {
        if (element[selectedType] === selectedValue) {
            newData.add(element);
        }
    });

    setCurrentData(newData);
}


///////////////////////////////////////////

export {
    getInitialData, setInitialData, 
    setCurrentData, getCurrentData, 
    clickableNode, updateCurrentDataWithNewNodes,
    getAllSources, getAllTargets,
    getAddedNodes, addNodeToAddedNodes, resetAddedNodes,
    getTypesOfLinks, 
    createActiveButtons, getActiveButtons, updateActiveButtons,
    updateCurrentDataBasedOnButtons,
    getSelectedSource, resetSelectedSource, setSelectedSource,
    getSelectedTarget, resetSelectedTarget, setSelectedTarget,  
    updateCurrentDataBasedOnSelect,
};
