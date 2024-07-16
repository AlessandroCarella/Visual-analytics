import { removeDuplicates } from "../utils";

function getPossibleNodes(data) {
    let sources = Array.from(new Set(data.map(d => d.source)));
    let targets = Array.from(new Set(data.map(d => d.target)));

    const sourcesTargets = sources.filter(value => targets.includes(value));

    targets = removeDuplicates(targets, sources);
    return { sources, targets, sourcesTargets };
}

function createNodesData(sources, targets, sourcesTargets, sourcesNotActiveButInGraph) {
    const nodesData = [];

    sources.forEach(source => {
        nodesData.push({ id: source, type: 'source', alsoSource: true, alsoTarget: sourcesTargets.includes(source) });
    });

    targets.forEach(target => {
        nodesData.push({ id: target, type: 'target', alsoSource: (sourcesTargets.includes(target) || sourcesNotActiveButInGraph.includes(target)), alsoTarget: true });
    });

    return nodesData;
}

function createLinksData(data, nodes) {
    const links = [];

    data.forEach(d => {
        const link = {
            source: nodes.find(node => node.id === d.source),
            target: nodes.find(node => node.id === d.target),
            typeOfLink: d.typeOfLink,
            weight: d.weight
        };
        links.push(link);
    });

    return links;
}

export { getPossibleNodes, createNodesData, createLinksData }