import { getCurrentData, getInitialData, getSelectedSource, getSelectedTarget } from "../dataManagement";
import { addLinksBetweenEntitesToInvestigate } from "../entitiesToInvestigateSpecial";
import { removeDuplicatesBetweenSet1AndSet2 } from "../utils";

function getPossibleNodes(data) {
    const sources = new Set(Array.from(data).map(d => d.source));
    let targets = new Set(Array.from(data).map(d => d.target));

    const sourcesTargets = new Set(Array.from(sources).filter(value => targets.has(value)));

    targets = removeDuplicatesBetweenSet1AndSet2(targets, sources);
    return { sources, targets, sourcesTargets };
}

function findSourcesNotActiveButInGraph (){
    const currentData = getCurrentData();
    const currentDataSources = new Set(Array.from(currentData).map(d => d.source));
    const currentDataTargets = new Set(Array.from(currentData).map(d => d.target));

    const initialDataSources = new Set (Array.from(getInitialData()).map(d => d.source));

    // Find initial data sources that are not in current data sources
    const inactiveSources = new Set([...initialDataSources].filter(source => !currentDataSources.has(source)));

    // Find inactive sources that are also in current data targets
    const inactiveSourcesInTargets = new Set([...inactiveSources].filter(source => currentDataTargets.has(source)));

    return inactiveSourcesInTargets;
}

function createNodesData(sources, targets, sourcesTargets, sourcesNotActiveButInGraph, dictSourceToTypeCountry) {
    const nodesData = [];

    sources.forEach(source => {
        nodesData.push(
            { 
                id: source, 
                type: 'source', 
                alsoSource: true, 
                alsoTarget: sourcesTargets.has(source), 
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
                alsoSource: (sourcesTargets.has(target) || sourcesNotActiveButInGraph.has(target)), 
                alsoTarget: true, 
                nodeType: dictSourceToTypeCountry[target]["nodeType"], 
                country: dictSourceToTypeCountry[target]["country"] 
            }
        );
    });
    
    return nodesData;
}

function createDictNodeToTypeCountry (data, sources, targets, sourcesTargets){
    let resultDict = {};
    
    const names = new Set([...sources, ...targets, ...sourcesTargets])

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

    links = addLinksBetweenEntitesToInvestigate(links, nodes);
    
    return links;
}

export { getPossibleNodes, createDictNodeToTypeCountry, createNodesData, createLinksData, findSourcesNotActiveButInGraph }