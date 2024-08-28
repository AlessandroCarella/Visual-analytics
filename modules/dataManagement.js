import * as d3 from 'd3';

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

function addNodeToAddedNodes(node, option='both') {
    addedNodes.add({node, option});
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

function clickableNode(node, option='both') {
    // Helper function to get the relevant links based on the node type
    function getRelevantLinks(node) {
        return Array.from(initialData).filter(link => {
            if (node.type === "source") {
                return ((link.source === node.id || (node.alsoTarget && link.target === node.id)) && link.typeOfLink !== linkToInvestigateTag);
            } else if (node.type === "target") {
                return ((link.target === node.id || (node.alsoSource && link.source === node.id)) && link.typeOfLink !== linkToInvestigateTag);
            }
            return false;
        });
    }

    // Helper function to determine if a link is relevant and expandable
    function isRelevantAndExpandable(link) {
        return !currentData.has(link) && getActiveButtons().has(link.typeOfLink);
    }

    // Helper function to determine if the node is expandable as source, target, or both
    function determineExpandability(relevantLinks) {
        let isSourceExpandable = false;
        let isTargetExpandable = false;

        for (const link of relevantLinks) {
            if (isRelevantAndExpandable(link)) {
                if (link.source === node.id) 
                    isSourceExpandable = true;
                if (link.target === node.id) 
                    isTargetExpandable = true;
                if (isSourceExpandable && isTargetExpandable) 
                    break; // Short-circuit if both are true
            }
        }

        if (isSourceExpandable && isTargetExpandable) {
            return 'both';
        } else if (isSourceExpandable) {
            return 'source';
        } else if (isTargetExpandable) {
            return 'target';
        } else {
            return 'not at all';
        }
    }

    // Main function logic
    const relevantLinks = getRelevantLinks(node);
    const expandableBy = determineExpandability(relevantLinks);

    // Return true if option is source or target and expandableBy is both
    if (expandableBy === 'both' && (option === 'source' || option === 'target')) {
        return true;
    }

    if (option === 'both' && expandableBy !== 'not at all') {
        return true;
    }

    return expandableBy === option;
}

function updateCurrentDataWithNewNodes() {
    let dataToAdd = new Set();
    let relevantLinks = [];

    addedNodes.forEach(item => {
        let newNode = item.node;
        let option = item.option;

        if (option === 'both') {
            if ((newNode.type === "target" && newNode.alsoSource) || (newNode.type === "source" && newNode.alsoTarget))
                relevantLinks = Array.from(initialData).filter(link => link.source === newNode.id || link.target === newNode.id);
            else if (newNode.type === 'source' && !newNode.alsoTarget) 
                relevantLinks = Array.from(initialData).filter(link => link.source === newNode.id);
            else if (newNode.type === 'target' && !newNode.alsoSource) 
                relevantLinks = Array.from(initialData).filter(link => link.target === newNode.id);
        }
        else if (option ==='source') {
            relevantLinks = Array.from(initialData).filter(link => link.source === newNode.id);
        }
        else if (option === 'target') {
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

import { companiesToInvestigate, companiesToInvestigateSelectVal, idSelectInvestigate, linkToInvestigateTag, selectAllNodesVal, typesOfLinks } from "./constants";

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
    if (getBothValueInvestigateDistance() !== -1 || getSourceValueInvestigateDistance()!== -1 || getTargetValueInvestigateDistance()!== -1) {
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

let currentlyClickedId = null;

function getCurrentlyClickedId() {
    return currentlyClickedId;
}

function setCurrentlyClickedId(id) {
    currentlyClickedId = id;
}

///////////////////////////////////////////

export {
    getCurrentlyClickedId, setCurrentlyClickedId, addNodeToAddedNodes, getLastAddedNodeId, setLastAddedNodeId, clickableNode, createActiveButtons, getActiveButtons, getAddedNodes, getAllSources, getAllTargets, getCurrentData, getInitialData, getInitialDataInvestigateDistanceSource, getInitialDataInvestigateDistanceTarget, getSelectedSource, getSelectedTarget, getSelectedValueInvestigate, getSourceValueInvestigateDistance, getTargetValueInvestigateDistance, getTypesOfLinks, resetAddedNodes, resetBothValueInvestigateDistance, resetOtherInputFromInvestigateDistance, resetSelectedSource, resetSelectedTarget, resetSelectedValueInvestigate, resetSourceValueInvestigateDistance, resetTargetValueInvestigateDistance, setCurrentData, setInitialData, setInitialDataInvestigateDistanceSource, setInitialDataInvestigateDistanceTarget, setSelectedSource, setSelectedTarget, setSelectedValueInvestigate, updateActiveButtons,
    updateCurrentDataBasedOnButtons, updateCurrentDataBasedOnInvestigateDistanceValues, updateCurrentDataBasedOnSelect, updateCurrentDataWithNewNodes
};
