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

///////////////////////////////////////////

let selectedSources = new Set();
let selectedTargets = new Set();

function getSelectedSources(){
    return selectedSources;
}

function updateSelectedSources (element, addTrueDeleteFalse){
    if (addTrueDeleteFalse) {
        selectedSources.add(element);
    } else {
        selectedSources.delete(element);
    }
}

function resetSelectedSources (){
    selectedSources = new Set();
}

function resetAndAddElemSelectedSources (element){
    resetSelectedSources()
    updateSelectedSources(element, true)
}

////////////////////

function getSelectedTargets(){
    return selectedTargets;
}

function updateSelectedTargets (element, addTrueDeleteFalse){
    if (addTrueDeleteFalse) {
        selectedTargets.add(element);
    } else {
        selectedTargets.delete(element);
    }
}

function resetSelectedTargets (){
    selectedTargets = new Set();
}

function resetAndAddElemSelectedTargets (element){
    resetSelectedTargets()
    updateSelectedTargets(element, true)
}

///////////////////////////////////////////

export { 
    getInitialData, setInitialData, setCurrentData, getCurrentData, 
    getTypesOfLinks, 
    createActiveButtons, getActiveButtons, updateActiveButtons,
    getSelectedSources, updateSelectedSources, resetSelectedSources, resetAndAddElemSelectedSources,
    getSelectedTargets, updateSelectedTargets, resetSelectedTargets, resetAndAddElemSelectedTargets,
     
};