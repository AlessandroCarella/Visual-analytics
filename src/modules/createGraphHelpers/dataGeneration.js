import { getCurrentData, getInitialData } from "../dataManagement";
import { removeDuplicatesBetweenSet1AndSet2 } from "../utils";

function getPossibleNodes(data) {
    const sources = new Set(data.map(d => d.source));
    let targets = new Set(data.map(d => d.target));

    const sourcesTargets = new Set(Array.from(sources).filter(value => targets.has(value)));

    targets = removeDuplicatesBetweenSet1AndSet2(targets, sources);
    return { sources, targets, sourcesTargets };
}

function findSourcesNotActiveButInGraph (){
    const currentData = getCurrentData();
    const currentDataSources = new Set(currentData.map(d => d.source));
    const currentDataTargets = new Set(currentData.map(d => d.target));

    const initialDataSources = new Set (getInitialData().map(d => d.source));

    // Find initial data sources that are not in current data sources
    const inactiveSources = new Set([...initialDataSources].filter(source => !currentDataSources.has(source)));

    // Find inactive sources that are also in current data targets
    const inactiveSourcesInTargets = [...inactiveSources].filter(source => currentDataTargets.has(source));

    return inactiveSourcesInTargets;
}

function createNodesData(sources, targets, sourcesTargets, sourcesNotActiveButInGraph) {
    const nodesData = [];

    sources.forEach(source => {
        nodesData.push({ id: source, type: 'source', alsoSource: true, alsoTarget: sourcesTargets.includes(source) });
    });

    targets.forEach(target => {
        nodesData.push({ id: target, type: 'target', alsoSource: (sourcesTargets.includes(target) || sourcesNotActiveButInGraph.includes(target)), alsoTarget: true });
    });

    return nodesData;
}

function createLinksData(data, nodes) {
    const links = [];

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

export { getPossibleNodes, findSourcesNotActiveButInGraph }