let initialData;
let currentData;

function getInitalData() {
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

let typesOfLinks;
let activeButtons;

function createTypesOfLinks(data){
    if (data && data.length > 0){
        console.log("AAA")
        typesOfLinks = Array.from(new Set(data.map(link => link.typeOfLink)));
    } else {
        console.log("BBB")
        typesOfLinks = Array.from(new Set(getInitalData().map(link => link.typeOfLink)));
    }
}

function getTypesOfLinks(){
    if (typesOfLinks === undefined) {
        createTypesOfLinks()
    }
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

const colors = d3
    .scaleOrdinal()
    .domain(getTypesOfLinks())
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

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
    getInitalData, setInitialData, setCurrentData, getCurrentData, 
    createTypesOfLinks, getTypesOfLinks, 
    createActiveButtons, getActiveButtons, updateActiveButtons,
    colors,
    getSelectedSources, updateSelectedSources, resetSelectedSources, resetAndAddElemSelectedSources,
    getSelectedTargets, updateSelectedTargets, resetSelectedTargets, resetAndAddElemSelectedTargets,
     
};