import { createLinks, createMarkers, createNodes, setupTooltip } from './createGraphHelpers/createEntities';
import { createDictNodeToTypeCountry, createLinksData, createNodesData, findSourcesOrTargetsNotActiveButInGraph, getPossibleNodes } from './createGraphHelpers/dataGeneration';
import { initializeSimulation } from './createGraphHelpers/simulation';
import { getCurrentData, getInitialData } from './dataManagement';
import { findPerSourceNumberOfTargetsOrOpposite } from './utils';

let initialData;
let simulation;

function createNodesAndLinks(data = getCurrentData()) {
    const { sources: sources, targets: targets, sourcesTargets: sourcesTargets, targetsSources: targetsSources } = getPossibleNodes(data);

    const dictNodeToTypeCountry = createDictNodeToTypeCountry(data, sources, targets, sourcesTargets, targetsSources);

    const sourcesNotActiveButInGraph = findSourcesOrTargetsNotActiveButInGraph("source");
    const targetsNotActiveButInGraph = findSourcesOrTargetsNotActiveButInGraph("target");

    const nodes = createNodesData(sources, targets, sourcesNotActiveButInGraph, targetsNotActiveButInGraph, dictNodeToTypeCountry);
    const links = createLinksData(nodes, data);

    return { nodes, links };
}

function createGraph() {
    //data generation
    const { nodes: nodes, links: links } = createNodesAndLinks(getCurrentData());
    const targetsPerSourceCount = findPerSourceNumberOfTargetsOrOpposite(getInitialData(), "source");
    const sourcesPerTargetCount = findPerSourceNumberOfTargetsOrOpposite(getInitialData(), "target");

    //simulation
    simulation = initializeSimulation(nodes, links);

    //graph enetites
    createLinks(links);
    createNodes(nodes, targetsPerSourceCount, sourcesPerTargetCount, simulation);
    createMarkers();
    //createLabels(nodes, targetsPerSourceCount, sourcesPerTargetCount);
    setupTooltip(targetsPerSourceCount, sourcesPerTargetCount);
}

export { createGraph, createNodesAndLinks, simulation };
