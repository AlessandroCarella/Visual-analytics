import { createLabels, createLinks, createMarkers, createNodes, setupTooltip } from './createGraphHelpers/createEntities';
import { createDictNodeToTypeCountry, createLinksData, createNodesData, getPossibleNodes } from './createGraphHelpers/dataGeneration';
import { initializeSimulation } from './createGraphHelpers/simulation';
import { getCurrentData, getInitialData } from './dataManagement';

let initialData;

function createGraph() {
    //data generation
    const { sources: sources, targets: targets, sourcesTargets: sourcesTargets, targetsSources:targetsSources } = getPossibleNodes(getCurrentData());

    const dictNodeToTypeCountry = createDictNodeToTypeCountry(getCurrentData(), sources, targets, sourcesTargets, targetsSources);

    const nodes = createNodesData(sources, targets, dictNodeToTypeCountry);
    const links = createLinksData(getCurrentData(), nodes);

    //simulation
    const simulation = initializeSimulation(nodes, links);

    //graph enetites
    createLinks(links);
    createNodes(nodes, simulation);
    createMarkers();
    createLabels(nodes);
    setupTooltip();
}

export { createGraph };
