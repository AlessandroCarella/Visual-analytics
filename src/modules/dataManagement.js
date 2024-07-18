let initialData;
let currentData;
let addedNodes = new Set();

function getInitialData() {
    return initialData;
}

function setInitialData (data){
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

function addNodeToAddedNodes(node){
    addedNodes.add(node);
}

function resetAddedNodes(){
    addedNodes.clear();
}

function updateCurrentDataWithNewNodes(newNode){
    //nodeType == source or target
    let dataToAdd = new Set()

    addedNodes.forEach(newNode => {
        //TODO add logic for nodes that are sources but also target to show the nodes that point at it
        initialData.forEach(element => {
            if (newNode.type === 'target' && newNode.alsoSource && element.source === newNode.id) {
                if (!currentData.has(element)){
                    dataToAdd.add(element)
                }
            }
        });
    });

    setCurrentData(new Set([...currentData,...dataToAdd]));
}

import { active } from "d3";
///////////////////////////////////////////

import { typesOfLinks } from "./constants";

let activeButtons;

function getTypesOfLinks(){
    return typesOfLinks;
}

///////////////////////////////////////////

function createActiveButtons(){
    activeButtons = new Set(getTypesOfLinks());
}

function getActiveButtons(){
    return activeButtons;
}

function updateActiveButtons (element, addTrueDeleteFalse){
    if (addTrueDeleteFalse) {
        activeButtons.add(element);
    } else {
        activeButtons.delete(element);
    }
}

function updateCurrentDataBasedOnButtons (){
    let newData = new Set();

    console.log(currentData)

    currentData.forEach(element => {
        if (activeButtons.has(element.typeOfLink)){
            newData.add(element);
        }
    });

    setCurrentData(newData);
}

///////////////////////////////////////////

const selectDefaultValue = 'all';
let selectedSource = selectDefaultValue;
let selectedTarget = selectDefaultValue;

function getSelectedSource(){
    return selectedSource;
}

function resetSelectedSource (){
    selectedSource = selectDefaultValue;
}

function setSelectedSource (element){
    selectedSource = element;
}

////////////////////

function getSelectedTarget(){
    return selectedTarget;
}

function resetSelectedTarget (){
    selectedTarget = selectDefaultValue;
}

function setSelectedTarget (element){
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
    setCurrentData, getCurrentData, updateCurrentDataWithNewNodes,
    getAddedNodes, addNodeToAddedNodes, resetAddedNodes,
    getTypesOfLinks, 
    createActiveButtons, getActiveButtons, updateActiveButtons,
    updateCurrentDataBasedOnButtons,
    getSelectedSource, resetSelectedSource, setSelectedSource,
    getSelectedTarget, resetSelectedTarget, setSelectedTarget,  
    selectDefaultValue, updateCurrentDataBasedOnSelect,
};