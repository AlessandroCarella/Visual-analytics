import { createLabels, createLinks, createMarkers, createNodes, preloadSvgs, setupTooltip } from './createGraphHelpers/createEntities';
import { createDictNodeToTypeCountry, createLinksData, createNodesData, findSourcesOrTargetsNotActiveButInGraph, getPossibleNodes } from './createGraphHelpers/dataGeneration';
import { initializeSimulation } from './createGraphHelpers/simulation';
import { getCurrentData, getInitialData } from './dataManagement';
import { findPerSourceNumberOfTargetsOrOpposite } from './utils';

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
    preloadSvgs().then(() => {
        createNodes(nodes, targetsPerSourceCount, sourcesPerTargetCount, simulation);
    });
    createLinks(links);
    createMarkers();
    //createLabels(nodes, targetsPerSourceCount, sourcesPerTargetCount);
    setupTooltip(targetsPerSourceCount, sourcesPerTargetCount);
}

export { createGraph };
