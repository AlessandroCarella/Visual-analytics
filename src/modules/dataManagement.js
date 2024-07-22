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

    //node.alsoSource and node.alsoTarget is good only for the color determination 
    //since it relies on current data instead of the initial ones
    // if (node.type === "target") {//target that becomes ALSO source
    //     if (node.alsoSource) {
    //         //all targets of the node in currentdata
    //         Array.from(initialData).filter(link => {
    //             return link.source === node.id;
    //         }).forEach(link => {
    //             if (!currentData.has(link) && getActiveButtons().has(link.typeOfLink)) {
    //                 needToAddNodeVar = true;
    //                 return needToAddNodeVar; //exit the loop
    //             }
    //         })
    //     }
    // }
    // else {//source that becomes ALSO target
    //     if (node.type === "source") {
    //         if (node.alsoTarget) {
    //             //all sources of the node in current data
    //             Array.from(initialData).filter(link => {
    //                 return link.target === node.id;
    //             }).forEach(link => {
    //                 if (!currentData.has(link) && getActiveButtons().has(link.typeOfLink)) {
    //                     needToAddNodeVar = true;
    //                     return needToAddNodeVar; //exit the loop
    //                 }
    //             })
    //         }
    //     }
    // }

    Array.from(initialData).filter(link => {
        return (link.source === node.id || link.target === node.id);
    }).forEach(link => {
        if (!currentData.has(link) && getActiveButtons().has(link.typeOfLink)) {
            needToAddNodeVar = true;
            return needToAddNodeVar; //exit the loop
        }
    })

    return needToAddNodeVar;
}

function updateCurrentDataWithNewNodes() {
    //nodeType == source or target
    let dataToAdd = new Set()

    addedNodes.forEach(newNode => {
        //TODO add logic for nodes that are sources but also target to show the nodes that point at it
        initialData.forEach(link => {
            if (
                // (newNode.type === 'target' && newNode.alsoSource && link.source === newNode.id)
                // ||
                // (newNode.type === 'source' && newNode.alsoTarget && link.target === newNode.id)
                link.source === newNode.id || link.target === newNode.id
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

let targetsPerSourceCount;
let sourcesPerTargetCount;

function findPerSourceNumberOfTargetsOrOpposite(data, type) {
    //find the number of targets for each source 
    //(or the number of sources for target based on the type passed)
    let result = {};

    data.forEach(d => {
        let key = type === 'source' ? d.source : d.target;

        if (!result[key]) {
            result[key] = 0;
        }
        result[key]++;
    });

    return result;
}

function setUpTargetsPerSourceCountAndViceversa (){ 
    targetsPerSourceCount = findPerSourceNumberOfTargetsOrOpposite(getInitialData(), "source");
    sourcesPerTargetCount = findPerSourceNumberOfTargetsOrOpposite(getInitialData(), "target");
}

function getTargetsPerSourceCountVal (nodeId){
    return targetsPerSourceCount[nodeId]??0;
}

function getSourcesPerTargetCountVal (nodeId){
    return sourcesPerTargetCount[nodeId]??0;
}

///////////////////////////////////////////

let initialSources;
let initialTargets;
let initialSourcesTargets = [];
let initialTargetsSources = [];

function getInitialSources(){
    return initialSources;
}

function getInitialTargets(){
    return initialTargets;
}

function getInitialSourcesTargets(){
    return initialSourcesTargets;
}

function getInitialTargetsSources(){
    return initialTargetsSources;
}

function generateInitialSourcesANDtargetsANDsourcesTargetsANDTargetsSources(){
    initialSources, initialTargets, initialSourcesTargets, initialTargetsSources = getPossibleNodes(getInitialData());
}

////////////////////

let initialDictNodeToTypeCountry;

function getInitialDictNodeToTypeCountry (){
    return initialDictNodeToTypeCountry;
}

function generateInitialDictNodeToTypeCountry (){
    initialDictNodeToTypeCountry = createDictNodeToTypeCountry(getInitialData(), getInitialSources(), getInitialTargets(), getInitialSourcesTargets(), getInitialTargetsSources())
}

////////////////////

let initialNodes = [];

function generateInitialNodesData() {
    initialNodes = createNodesData(initialSources, initialTargets, initialDictNodeToTypeCountry)
}

function getInitialNodesData() {
    return initialNodes;
}

////////////////////

let initialLinks = [];

function generateInitialLinksData() {
    createLinksData (getInitialData(), getInitialNodesData())
}

function getInitialLinksData() {
    return initialLinks;
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
import { createDictNodeToTypeCountry, createLinksData, createNodesData, getPossibleNodes } from "./createGraphHelpers/dataGeneration";
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
    setUpTargetsPerSourceCountAndViceversa, getTargetsPerSourceCountVal, getSourcesPerTargetCountVal,
    getInitialSources, getInitialTargets, getInitialSourcesTargets, getInitialTargetsSources,generateInitialSourcesANDtargetsANDsourcesTargetsANDTargetsSources,
    getInitialDictNodeToTypeCountry, generateInitialDictNodeToTypeCountry,
    generateInitialNodesData, getInitialNodesData,
    generateInitialLinksData, getInitialLinksData,
    getAddedNodes, addNodeToAddedNodes, resetAddedNodes,
    getTypesOfLinks, 
    createActiveButtons, getActiveButtons, updateActiveButtons,
    updateCurrentDataBasedOnButtons,
    getSelectedSource, resetSelectedSource, setSelectedSource,
    getSelectedTarget, resetSelectedTarget, setSelectedTarget,  
    selectDefaultValue, updateCurrentDataBasedOnSelect,
};
