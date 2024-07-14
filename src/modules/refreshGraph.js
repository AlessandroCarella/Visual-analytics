// refreshGraph.js
import * as d3 from 'd3';
import { svg, color, activeButtons } from '../index';
import { createGraph } from './createGraph';

function refreshGraph(data, activeSources = []) {
    // Get the current state of the selects
    const sourceSelect = document.querySelector('#source-select').value;
    const targetSelect = document.querySelector('#target-select').value;

    // Filter data based on active buttons and selects
    const filteredData = data.filter(d => {
        const isActiveType = activeButtons.has(d.type);
        const isSourceMatch = (sourceSelect === 'all') || (d.source === sourceSelect);
        const isTargetMatch = (targetSelect === 'all') || (d.target === targetSelect);
        return isActiveType && isSourceMatch && isTargetMatch;
    });

    const allSources = new Set(data.map(element => element.source));
    console.log("all sources", allSources)
    const filteredTargets = new Set(filteredData.map(element => element.target));
    console.log("filtered targets", filteredTargets)
    const sourcesNotInGraph = new Set([...allSources].filter(element => filteredTargets.has(element)));
    console.log("sources not in graph", sourcesNotInGraph)

    // Clear existing graph elements
    svg.selectAll('*').remove();

    // Create the graph with the filtered data
    createGraph(filteredData);
}

export { refreshGraph };
