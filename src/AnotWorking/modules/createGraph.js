import { svg } from '../index';
import { getGraphDimensions, findPerSourceNumberOfTargets } from './utils';
import { getPossibleNodes, createNodesData, createLinksData } from './createGraphHelpers/dataGeneration';
import { initializeSimulation, ticked } from './createGraphHelpers/simulation';
import { createLinks, createNodes, createMarkers, createLabels, setupTooltip } from './createGraphHelpers/createEntities';
import { getCurrentData } from './dataManagement';

let initialData;

function createGraph(sourcesNotActiveButInGraph = []) {
    const { width, height } = getGraphDimensions();

    const { sources: sources, targets: targets, sourcesTargets: sourcesTargets } = getPossibleNodes(getCurrentData());
    const targetsPerSourceCount = findPerSourceNumberOfTargets(getCurrentData());

    let allPossibleSources = sources.concat(sourcesNotActiveButInGraph);
    let unactivatedSources = sourcesNotActiveButInGraph;
    
    const nodes = createNodesData(sources, targets, sourcesTargets, sourcesNotActiveButInGraph);
    const links = createLinksData(getCurrentData(), nodes, sourcesTargets);

    const simulation = initializeSimulation(nodes, links, width, height, svg, () => ticked(width, height, svg));


    createLinks(links);
    createNodes(nodes, targetsPerSourceCount, data, initialData, simulation, allPossibleSources, unactivatedSources);
    createMarkers();
    createLabels(nodes, targetsPerSourceCount);
    setupTooltip();
}

export { createGraph }