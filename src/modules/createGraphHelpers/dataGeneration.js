import { getCurrentData, getInitialData, getInitialDictNodeToTypeCountry, getInitialLinksData, getInitialNodesData, getInitialSources, getInitialSourcesTargets, getInitialTargets, getInitialTargetsSources, getSourcesPerTargetCountVal, getTargetsPerSourceCountVal } from "../dataManagement";
import { isObjectEmpty, removeDuplicatesBetweenSet1AndSet2 } from "../utils";

function getPossibleNodes(data) {
    if (data === getInitialData()) {
        if (getInitialSources().length !== 0 && getInitialTargets().length !== 0 && getInitialSourcesTargets().length !== 0 && getInitialTargetsSources().length !== 0) {
            return {
                sources: getInitialSources(),
                targets: getInitialTargets(),
                sourcesTargets: getInitialSourcesTargets(),
                targetsSources: getInitialTargetsSources()
            };
        }
    }
    
    const sources = new Set(Array.from(data).map(d => d.source));
    let targets = new Set(Array.from(data).map(d => d.target));

    const sourcesTargets = new Set(Array.from(sources).filter(value => targets.has(value)));
    const targetsSources = new Set(Array.from(targets).filter(value => sources.has(value)));

    targets = removeDuplicatesBetweenSet1AndSet2(targets, sources);
    return { sources, targets, sourcesTargets, targetsSources };
}

function findSourcesOrTargetsNotActiveButInGraph(type) {
    const currentData = getCurrentData();
    const currentDataSources = new Set(Array.from(currentData).map(d => d.source));
    const currentDataTargets = new Set(Array.from(currentData).map(d => d.target));

    let initialDataNodes;
    let inactiveNodes;

    if(type === "source"){
        initialDataNodes = new Set(Array.from(getInitialData()).map(d => d.source));
        // Find initial data sources that are not in current data sources
        inactiveNodes = new Set([...initialDataNodes].filter(node => !currentDataSources.has(node)));
        // Find inactive sources that are also in current data targets
        let inactiveSourcesInTargets = new Set([...inactiveNodes].filter(node => currentDataTargets.has(node)));
        return inactiveSourcesInTargets;
    }
    else{
        initialDataNodes = new Set(Array.from(getInitialData()).map(d => d.target));
        // Find initial data targets that are not in current data sources
        inactiveNodes = new Set([...initialDataNodes].filter(node => !currentDataTargets.has(node)));
        // Find inactive targets that are also in current data targets
        let inactiveTargetsInSources = new Set([...inactiveNodes].filter(node => currentDataSources.has(node)));
        return inactiveTargetsInSources;
    }
}

function findTargetsNotActiveButInGraph() {
    const currentData = getCurrentData();
    const currentDataTargets = new Set(Array.from(currentData).map(d => d.target));
    const currentDataSources = new Set(Array.from(currentData).map(d => d.source));

    const initialDataTargets = new Set(Array.from(getInitialData()).map(d => d.target));

    // Find initial data targets that are not in current data targets
    const inactiveTargets = new Set([...initialDataTargets].filter(target => !currentDataTargets.has(target)));

    // Find inactive targets that are also in current data sources
    const inactiveTargetsInSources = new Set([...inactiveTargets].filter(target => currentDataSources.has(target)));

    return inactiveTargetsInSources;
}


function createNodesData(sources, targets, dictSourceToTypeCountry) {
    if (sources === getInitialSources() && targets === getInitialTargets() && typeof dictSourceToTypeCountry !== 'undefined'){
        return getInitialNodesData();
    }



    const nodesData = [];
   
    sources.forEach(source => {
        nodesData.push(
            {
                id: source,
                type: 'source',
                alsoSource: true,
                alsoTarget: (getTargetsPerSourceCountVal(source) > 0),
                nodeType: dictSourceToTypeCountry[source]["nodeType"],
                country: dictSourceToTypeCountry[source]["country"]
            }
        );
    });

    targets.forEach(target => {
        nodesData.push(
            {
                id: target,
                type: 'target',
                alsoSource: (getSourcesPerTargetCountVal(target) > 0),
                alsoTarget: true,
                nodeType: dictSourceToTypeCountry[target]["nodeType"],
                country: dictSourceToTypeCountry[target]["country"]
            }
        );
    });

    return nodesData;
}

function createDictNodeToTypeCountry(data, sources, targets, sourcesTargets, targetsSources) {
    if (data === getInitialData() && typeof getInitialDictNodeToTypeCountry() !== 'undefined') {
        return getInitialDictNodeToTypeCountry();
    }

    let resultDict = {};

    const names = new Set([...sources, ...targets, ...sourcesTargets, ...targetsSources])

    data.forEach(obj => {
        const source = obj.source;
        const target = obj.target;

        // Check if the source matches any string in the list
        if (names.has(source)) {
            resultDict[source] = {
                nodeType: obj.sourceType,
                country: obj.sourceCountry
            };
        }

        // Check if the target matches any string in the list
        if (names.has(target)) {
            resultDict[target] = {
                nodeType: obj.targetType,
                country: obj.targetCountry
            };
        }
    });

    return resultDict;
}

function createLinksData(data, nodes) {
    if (data === getInitialData() && getInitialLinksData().length !== 0){
        return getInitialLinksData();
    }

    let links = [];

    data.forEach(d => {
        const link = {
            source: nodes.find(node => node.id === d.source),
            target: nodes.find(node => node.id === d.target),
            typeOfLink: d.typeOfLink,
            weight: d.weight
        };
        links.push(link);
    });

    return links;
}

export { createDictNodeToTypeCountry, createLinksData, createNodesData, findSourcesOrTargetsNotActiveButInGraph, getPossibleNodes };
