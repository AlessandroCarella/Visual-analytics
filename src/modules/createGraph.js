import { svg } from '../index';
import { getPossibleNodes, findSourcesNotActiveButInGraph, createLinksData } from './createGraphHelpers/dataGeneration';
import { getCurrentData, getInitialData } from './dataManagement';
import { findPerSourceNumberOfTargetsOrOpposite } from './utils';

import { initializeSimulation } from './createGraphHelpers/simulation'
import { createLinks, createNodes, createMarkers, createLabels, setupTooltip } from './createGraphHelpers/createEntities'

let initialData;

function createGraph() {
    //data generation
    const { sources: sources, targets: targets, sourcesTargets: sourcesTargets } = getPossibleNodes(getCurrentData());
    
    const targetsPerSourceCount = findPerSourceNumberOfTargetsOrOpposite(getCurrentData(), "source");
    
    const unactivatedSources = findSourcesNotActiveButInGraph();
    const allPossibleSources = new Set([...sources, ...unactivatedSources]);

    const nodes = getCurrentData()//createNodesData(sources, targets, sourcesTargets, sourcesNotActiveButInGraph);
    const links = createLinksData (getCurrentData(), nodes, sourcesTargets);

    const simulation = initializeSimulation(nodes, links);


    createLinks(links);
    createNodes(nodes, targetsPerSourceCount, getCurrentData(), getInitialData(), simulation, allPossibleSources, unactivatedSources);
    createMarkers();
    createLabels(nodes, targetsPerSourceCount);
    setupTooltip();
}

export { createGraph }