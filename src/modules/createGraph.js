import { svg } from '../index';
import { getGraphDimensions, findNumberOfTargets } from './utils';
import { getPossibleNodes, createNodesData, createLinksData } from './createGraphHelpers/dataGeneration';
import { initializeSimulation, ticked } from './createGraphHelpers/simulation';
import { createLinks, createNodes, createMarkers, createLabels, setupTooltip } from './createGraphHelpers/createEntities';

let initialData;

function createGraph(data, sourcesNotActiveButInGraph = []) {
    console.log(initialData)
    const { width, height } = getGraphDimensions();

    const { sources: sources, targets: targets, sourcesTargets: sourcesTargets } = getPossibleNodes(data);
    const targetsPerSourceCount = findNumberOfTargets(data);

    const nodes = createNodesData(sources, targets, sourcesTargets, sourcesNotActiveButInGraph);
    const links = createLinksData(data, nodes, sourcesTargets);

    const simulation = initializeSimulation(nodes, links, width, height, svg, () => ticked(width, height, svg));

    let allPossibleSources = sources.concat(sourcesNotActiveButInGraph);
    let unactivatedSources = sourcesNotActiveButInGraph;

    createLinks(links);
    createNodes(nodes, targetsPerSourceCount, data, initialData, simulation, allPossibleSources, unactivatedSources);
    createMarkers();
    createLabels(nodes, targetsPerSourceCount);
    setupTooltip();
}

export { createGraph }