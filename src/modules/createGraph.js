import { getPossibleNodes, findSourcesNotActiveButInGraph } from './createGraphHelpers/dataGeneration';
import { getCurrentData } from './dataManagement';
import { findPerSourceNumberOfTargetsOrOpposite } from './utils';
import { createLinksData, createNodesData } from './createGraphHelpers/dataGeneration';
import { initializeSimulation } from './createGraphHelpers/simulation'
import { createLinks, createNodes, createMarkers, createLabels, setupTooltip } from './createGraphHelpers/createEntities'

let initialData;

function createGraph() {

    //data generation
    const { sources: sources, targets: targets, sourcesTargets: sourcesTargets } = getPossibleNodes(getCurrentData());
    
    const targetsPerSourceCount = findPerSourceNumberOfTargetsOrOpposite(getCurrentData(), "source");
    
    const sourcesNotActiveButInGraph = findSourcesNotActiveButInGraph();
    const allPossibleSources = new Set([...sources, ...sourcesNotActiveButInGraph]);

    const nodes = createNodesData(sources, targets, sourcesTargets, sourcesNotActiveButInGraph);
    const links = createLinksData (getCurrentData(), nodes, sourcesTargets);

    //simulation
    const simulation = initializeSimulation(nodes, links);

    //graph enetites
    createLinks(links);
    createNodes(nodes, targetsPerSourceCount, simulation, allPossibleSources, sourcesNotActiveButInGraph);
    createMarkers();
    createLabels(nodes, targetsPerSourceCount);
    setupTooltip();
}

export { createGraph }