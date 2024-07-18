let initialData;
let currentData;

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

function updateCurrentDataWithNewNode(nodeId, nodeType){
    //nodeType == source or target
    let dataToAdd = new Set()
    
    //TODO add logic for target, eventually
    initialData.forEach(element => {
        if (nodeType === 'source' && element.source === nodeId) {
            if (!currentData.has(element)){
                dataToAdd.add(element)
                console.log("added", element)
            }
        }
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

    currentData.forEach(element => {
        if (activeButtons.has(element.typesOfLink)){
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

function updateCurrentDataBasedOnSelect (){
    //handle default case where source and target are 'all'
    let selectedValue = selectedSource;
    let selectedType = 'source';
    if (selectedSource === selectDefaultValue){
        selectedValue = selectedTarget;
        selectedType = 'target';
    }
    if (selectedValue === selectDefaultValue){
        return initialData;
    }

    let newData = new Set();
    initialData.forEach(element => {
        if (selectedType === 'source' && element.source === selectedValue) {
            newData.add(element);
        } else if (selectedType === 'target' && element.target === selectedValue) {
            newData.add(element);
        }
    });

    setCurrentData (newData);
}

///////////////////////////////////////////

export { 
    getInitialData, setInitialData, 
    setCurrentData, getCurrentData, updateCurrentDataWithNewNode,
    getTypesOfLinks, 
    createActiveButtons, getActiveButtons, updateActiveButtons,
    updateCurrentDataBasedOnButtons,
    getSelectedSource, resetSelectedSource, setSelectedSource,
    getSelectedTarget, resetSelectedTarget, setSelectedTarget,  
    selectDefaultValue, updateCurrentDataBasedOnSelect,
};