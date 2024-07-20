import { getPossibleNodes, findSourcesNotActiveButInGraph } from './createGraphHelpers/dataGeneration';
import { getCurrentData, getInitialData } from './dataManagement';
import { findPerSourceNumberOfTargetsOrOpposite } from './utils';
import { createLinksData, createNodesData, createDictNodeToTypeCountry } from './createGraphHelpers/dataGeneration';
import { initializeSimulation } from './createGraphHelpers/simulation'
import { createLinks, createNodes, createMarkers, createLabels, setupTooltip } from './createGraphHelpers/createEntities'

let initialData;

function createGraph() {

    //data generation
    const { sources: sources, targets: targets, sourcesTargets: sourcesTargets } = getPossibleNodes(getCurrentData());
    
    const dictSourceToTypeCountry = createDictNodeToTypeCountry (getCurrentData(), sources, targets, sourcesTargets);

    const targetsPerSourceCount = findPerSourceNumberOfTargetsOrOpposite(getInitialData(), "source");
    const sourcesPerTargetCount = findPerSourceNumberOfTargetsOrOpposite(getCurrentData(), "target");

    const sourcesNotActiveButInGraph = findSourcesNotActiveButInGraph();
    const allPossibleSources = new Set([...sources, ...sourcesNotActiveButInGraph]);

    const nodes = createNodesData(sources, targets, sourcesTargets, sourcesNotActiveButInGraph, dictSourceToTypeCountry);
    const links = createLinksData (getCurrentData(), nodes, sourcesTargets);

    //simulation
    const simulation = initializeSimulation(nodes, links);

    //graph enetites
    createLinks(links);
    createNodes(nodes, targetsPerSourceCount, sourcesPerTargetCount, simulation, allPossibleSources, sourcesNotActiveButInGraph);
    createMarkers();
    createLabels(nodes, targetsPerSourceCount, sourcesPerTargetCount);
    setupTooltip(targetsPerSourceCount, sourcesPerTargetCount);
}

export { createGraph }