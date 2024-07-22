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

function needToAddNode(node) {
    let needToAddNodeVar = false;//sorry for the funky name, js really likes to assign boolean values to variables

    if (node.type === "target") {//target that becomes ALSO source
        if (node.alsoSource) {
            //all targets of the node in currentdata
            Array.from(initialData).filter(link => {
                return link.source === node.id;
            }).forEach(link => {
                if (!currentData.has(link) && getActiveButtons().has(link.typeOfLink)) {
                    needToAddNodeVar = true;
                    return needToAddNodeVar; //exit the loop
                }
            })
        }
    }
    else {//source that becomes ALSO target
        if (node.type === "source") {
            if (node.alsoTarget) {
                //all sources of the node in current data
                Array.from(initialData).filter(link => {
                    return link.target === node.id;
                }).forEach(link => {
                    if (!currentData.has(link) && getActiveButtons().has(link.typeOfLink)) {
                        needToAddNodeVar = true;
                        return needToAddNodeVar; //exit the loop
                    }
                })
            }
        }
    }

    return needToAddNodeVar;
}

function updateCurrentDataWithNewNodes() {
    //nodeType == source or target
    let dataToAdd = new Set()

    addedNodes.forEach(newNode => {
        //TODO add logic for nodes that are sources but also target to show the nodes that point at it
        initialData.forEach(link => {
            if (
                (newNode.type === 'target' && newNode.alsoSource && link.source === newNode.id)
                ||
                (newNode.type === 'source' && newNode.alsoTarget && link.target === newNode.id)
            ) {
                if (!currentData.has(link)) {
                    dataToAdd.add(link)
                }
            }
        });
    });

    setCurrentData(new Set([...currentData, ...dataToAdd]));
}

///////////////////////////////////////////

let allSources = new Set();
let allTargets = new Set();

function getAllSources() {
    if (allSources.length === 0 || typeof allSources.length === 'undefined'){
        allSources = new Set(Array.from(initialData).map(d => d.source));
    }
    return allSources;
}

function getAllTargets() {
    if (allTargets.length === 0 || typeof allTargets.length === 'undefined'){
        allTargets = new Set(Array.from(initialData).map(d => d.target));
    }
    return allTargets;
}

///////////////////////////////////////////

import { companiesToInvestigate, companiesToInvestigateSelectVal, typesOfLinks } from "./constants";

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

import { selectDefaultValue, sourceSelectTag, targetSelectTag } from './constants';
let selectedSource = selectDefaultValue;
let selectedTarget = selectDefaultValue;

function getSelectedSource() {
    return selectedSource;
}

function resetSelectedSource() {
    d3.select(sourceSelectTag).property('value', selectDefaultValue);
    selectedSource = selectDefaultValue;
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
    d3.select(targetSelectTag).property('value', selectDefaultValue);
    selectedTarget = selectDefaultValue;
}

function setSelectedTarget(element) {
    resetAddedNodes();
    selectedTarget = element;
}

///////////////////

function updateCurrentDataBasedOnSelect() {
    let selectedValue = selectedSource !== selectDefaultValue ? selectedSource : selectedTarget;
    let selectedType = selectedSource !== selectDefaultValue ? 'source' : 'target';

    if (selectedSource === selectDefaultValue && selectedTarget === selectDefaultValue) {
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
    needToAddNode, updateCurrentDataWithNewNodes,
    getAllSources, getAllTargets,
    getAddedNodes, addNodeToAddedNodes, resetAddedNodes,
    getTypesOfLinks, 
    createActiveButtons, getActiveButtons, updateActiveButtons,
    updateCurrentDataBasedOnButtons,
    getSelectedSource, resetSelectedSource, setSelectedSource,
    getSelectedTarget, resetSelectedTarget, setSelectedTarget,  
    selectDefaultValue, updateCurrentDataBasedOnSelect,
};
