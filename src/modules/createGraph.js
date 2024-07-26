import { createLabels, createLinks, createMarkers, createNodes, setupTooltip } from './createGraphHelpers/createEntities';
import { createDictNodeToTypeCountry, createLinksData, createNodesData, findSourcesOrTargetsNotActiveButInGraph, getPossibleNodes } from './createGraphHelpers/dataGeneration';
import { initializeSimulation } from './createGraphHelpers/simulation';
import { getCurrentData, getInitialData } from './dataManagement';
import { findPerSourceNumberOfTargetsOrOpposite } from './utils';

let initialData;

function createGraph() {
    //data generation
    const { sources: sources, targets: targets, sourcesTargets: sourcesTargets, targetsSources: targetsSources } = getPossibleNodes(getCurrentData());

    const dictNodeToTypeCountry = createDictNodeToTypeCountry(getCurrentData(), sources, targets, sourcesTargets, targetsSources);

    const targetsPerSourceCount = findPerSourceNumberOfTargetsOrOpposite(getInitialData(), "source");
    const sourcesPerTargetCount = findPerSourceNumberOfTargetsOrOpposite(getInitialData(), "target");

    const sourcesNotActiveButInGraph = findSourcesOrTargetsNotActiveButInGraph("source");
    const targetsNotActiveButInGraph = findSourcesOrTargetsNotActiveButInGraph("target");

    const nodes = createNodesData(sources, targets, sourcesNotActiveButInGraph, targetsNotActiveButInGraph, dictNodeToTypeCountry);
    const links = createLinksData(getCurrentData(), nodes);

    //simulation
    const simulation = initializeSimulation(nodes, links);

    //graph enetites
    createLinks(links);
    let allImages = createNodes(nodes, targetsPerSourceCount, sourcesPerTargetCount, simulation);
    createMarkers();
    //createLabels(nodes, targetsPerSourceCount, sourcesPerTargetCount);
    setupTooltip(targetsPerSourceCount, sourcesPerTargetCount);
}

export { createGraph };
