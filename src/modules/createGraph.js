import { createLabels, createLinks, createMarkers, createNodes, preloadSvgs, setupTooltip } from './createGraphHelpers/createEntities';
import { createDictNodeToTypeCountry, createLinksData, createNodesData, findSourcesOrTargetsNotActiveButInGraph, getPossibleNodes } from './createGraphHelpers/dataGeneration';
import { initializeSimulation } from './createGraphHelpers/simulation';
import { getCurrentData, getInitialData } from './dataManagement';
import { findPerSourceNumberOfTargetsOrOpposite } from './utils';

let initialData;
let simulation;

function createNodesAndLinks() {
    const { sources: sources, targets: targets, sourcesTargets: sourcesTargets, targetsSources: targetsSources } = getPossibleNodes(getCurrentData());

    const dictNodeToTypeCountry = createDictNodeToTypeCountry(getCurrentData(), sources, targets, sourcesTargets, targetsSources);

    const sourcesNotActiveButInGraph = findSourcesOrTargetsNotActiveButInGraph("source");
    const targetsNotActiveButInGraph = findSourcesOrTargetsNotActiveButInGraph("target");

    const nodes = createNodesData(sources, targets, sourcesNotActiveButInGraph, targetsNotActiveButInGraph, dictNodeToTypeCountry);
    const links = createLinksData(nodes);

    return { nodes, links };
}

function createGraph() {
    //data generation
    const { nodes: nodes, links: links } = createNodesAndLinks();
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
