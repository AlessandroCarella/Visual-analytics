let initialData;
let currentData;
let addedNodes = new Set();
let lastAddedNodeId = "";

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

function getLastAddedNodeId() {
    return lastAddedNodeId;
}

function setLastAddedNodeId(nodeId) {
    lastAddedNodeId = nodeId;
}

let relevantLinks;

function clickableNode(node) {
    let clickableNodeVar = false;

    if ((node.type === "target" && node.alsoSource) || (node.type === "source" && node.alsoTarget)) {
        relevantLinks = Array.from(initialData).filter(link => link.source === node.id || link.target === node.id);
    } else if (node.type === "source" && !node.alsoTarget) {
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

import { companiesToInvestigate, companiesToInvestigateSelectVal, idSelectInvestigate, selectAllNodesVal, typesOfLinks } from "./constants";

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

let initialDataInvestigateDistanceSource;
let initialDataInvestigateDistanceTarget;

function getInitialDataInvestigateDistanceSource() {
    return initialDataInvestigateDistanceSource;
}

function setInitialDataInvestigateDistanceSource(data) {
    initialDataInvestigateDistanceSource = data;
}

function getInitialDataInvestigateDistanceTarget() {
    return initialDataInvestigateDistanceTarget;
}

function setInitialDataInvestigateDistanceTarget(data) {
    initialDataInvestigateDistanceTarget = data;
}

function getInitialDataInvestigateDistanceBoth() {
    let initialDataInvestigateDistanceBoth = {};

    // Merge arrays from both sources for each entity and level
    for (let entity in initialDataInvestigateDistanceSource) {
        if (!initialDataInvestigateDistanceBoth[entity]) {
            initialDataInvestigateDistanceBoth[entity] = {};
        }

        for (let level in initialDataInvestigateDistanceSource[entity]) {
            // Combine arrays from source and target
            // and
            // Remove duplicates from the combined array
            initialDataInvestigateDistanceBoth[entity][level] = [...new Set(
                initialDataInvestigateDistanceSource[entity][level].concat(
                    initialDataInvestigateDistanceTarget[entity][level]
                )
            )];
        }
    }

    return initialDataInvestigateDistanceBoth;
}

function getSourceValueInvestigateDistance() {
    const sourceInput = document.getElementById('sourceNumberInput');
    return parseInt(sourceInput.value);
}

function getTargetValueInvestigateDistance() {
    const targetInput = document.getElementById('targetNumberInput');
    return parseInt(targetInput.value);
}

function getBothValueInvestigateDistance() {
    const bothInput = document.getElementById('bothNumberInput');
    return parseInt(bothInput.value);
}

function resetSourceValueInvestigateDistance() {
    document.getElementById('sourceNumberInput').value = -1;
}

function resetTargetValueInvestigateDistance() {
    document.getElementById('targetNumberInput').value = -1;
}

function resetBothValueInvestigateDistance() {
    document.getElementById('bothNumberInput').value = -1;
}

function resetOtherInputFromInvestigateDistance(currentInputId) {
    if (currentInputId === 'sourceNumberInput') {
        resetTargetValueInvestigateDistance();
        resetBothValueInvestigateDistance();
    } else if (currentInputId === 'targetNumberInput') {
        resetSourceValueInvestigateDistance();
        resetBothValueInvestigateDistance();
    }
    else if (currentInputId === 'bothNumberInput') {
        resetSourceValueInvestigateDistance();
        resetTargetValueInvestigateDistance();
    }

    //select reset
    resetSelectedSource()
    resetSelectedTarget()
}

function determineSelectionInvestigateDistance() {
    let selectedLevel = -1;
    let selectedKind;

    if (getSourceValueInvestigateDistance() !== -1) {
        selectedLevel = getSourceValueInvestigateDistance();
        selectedKind = 'source';
    }
    if (getTargetValueInvestigateDistance() !== -1) {
        selectedLevel = getTargetValueInvestigateDistance();
        selectedKind = 'target';
    }
    if (getBothValueInvestigateDistance() !== -1) {
        selectedLevel = getBothValueInvestigateDistance();
        selectedKind = 'both';
    }

    return { selectedLevel, selectedKind };
}

function getDataToWorkWithInvestigateDistance(selectedKind, selectedLevel) {
    if (selectedKind === 'source') {
        return getInitialDataInvestigateDistanceSource();
    } else if (selectedKind === 'target') {
        return getInitialDataInvestigateDistanceTarget();
    } else if (selectedKind === 'both') {
        return getInitialDataInvestigateDistanceBoth();
    }
    return {}; // Return an empty object if no valid kind is provided
}

function processNodesIdsInvestigateDistance(dataToWorkWith, selectedLevel, companiesToInvestigate) {
    let selectedToInvestigateEntity = d3.select(idSelectInvestigate).property("value")

    let nodesIdsToConsider = companiesToInvestigate.slice(); // Copying the array

    for (let entity in dataToWorkWith) {
        if (entity === selectedToInvestigateEntity || selectedToInvestigateEntity === selectAllNodesVal) {
            for (let level in dataToWorkWith[entity]) {
                if (parseInt(level) <= selectedLevel) {
                    nodesIdsToConsider = nodesIdsToConsider.concat(dataToWorkWith[entity][level]);
                }
            }
        }
    }

    return new Set(nodesIdsToConsider); // Return a Set of nodes IDs to consider
}

function filterAndSetCurrentDataInvestigateDistance(nodesIdsToConsider) {
    const filteredData = new Set(Array.from(initialData).filter(link =>
        nodesIdsToConsider.has(link.source) && nodesIdsToConsider.has(link.target)
    ));

    setCurrentData(filteredData);
}

function updateCurrentDataBasedOnInvestigateDistanceValues() {
    let dropdown = d3.select(idSelectInvestigate);
    if (dropdown.property("value") === selectEmptyVal) {
        dropdown.property('value', selectAllNodesVal);
    }

    const { selectedLevel, selectedKind } = determineSelectionInvestigateDistance();

    if (selectedLevel === -1) {
        setCurrentData(currentData);
        return;
    }

    const dataToWorkWith = getDataToWorkWithInvestigateDistance(selectedKind, selectedLevel);
    const nodesIdsToConsider = processNodesIdsInvestigateDistance(dataToWorkWith, selectedLevel, companiesToInvestigate);

    filterAndSetCurrentDataInvestigateDistance(nodesIdsToConsider);
}

///////////////////

let selectedValueInvestigate = companiesToInvestigateSelectVal;

function getSelectedValueInvestigate() {
    return selectedValueInvestigate;
}

function setSelectedValueInvestigate(value) {
    selectedValueInvestigate = value;
}

function resetSelectedValueInvestigate() {
    d3.select(idSelectInvestigate).property('value', selectEmptyVal);
    selectedValueInvestigate = selectEmptyVal;
}

///////////////////////////////////////////

export {
    addNodeToAddedNodes, getLastAddedNodeId, setLastAddedNodeId, clickableNode, createActiveButtons, getActiveButtons, getAddedNodes, getAllSources, getAllTargets, getCurrentData, getInitialData, getInitialDataInvestigateDistanceSource, getInitialDataInvestigateDistanceTarget, getSelectedSource, getSelectedTarget, getSelectedValueInvestigate, getSourceValueInvestigateDistance, getTargetValueInvestigateDistance, getTypesOfLinks, resetAddedNodes, resetBothValueInvestigateDistance, resetOtherInputFromInvestigateDistance, resetSelectedSource, resetSelectedTarget, resetSelectedValueInvestigate, resetSourceValueInvestigateDistance, resetTargetValueInvestigateDistance, setCurrentData, setInitialData, setInitialDataInvestigateDistanceSource, setInitialDataInvestigateDistanceTarget, setSelectedSource, setSelectedTarget, setSelectedValueInvestigate, updateActiveButtons,
    updateCurrentDataBasedOnButtons, updateCurrentDataBasedOnInvestigateDistanceValues, updateCurrentDataBasedOnSelect, updateCurrentDataWithNewNodes
};
