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

let typesOfLinks;
let activeButtons;

function createTypesOfLinks(){
    typesOfLinks = Array.from(new Set(getInitalData ().map(link => link.typeOfLink)))
}

function getTypesOfLinks(){
    if (typesOfLinks === undefined) {
        createTypesOfLinks()
    }
    return typesOfLinks;
}

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

export { 
    getInitalData, setInitialData, setCurrentData, getCurrentData, 
    createTypesOfLinks, getTypesOfLinks, createActiveButtons, getActiveButtons, updateActiveButtons
};