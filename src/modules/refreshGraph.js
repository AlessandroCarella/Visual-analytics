// refreshGraph.js
import * as d3 from 'd3';
import { svg, color, activeButtons } from '../index';
import { createGraph } from './createGraph';
import { isObjectEmpty } from './utils';

function refreshGraph(data, initialData, sourceToAdd = {}) {    
    d3.selectAll('div-tooltip.tooltip').style('opacity', 0); // Hide tooltip on click
        
    const sourceSelect = document.querySelector('#source-select').value;
    const targetSelect = document.querySelector('#target-select').value;

    // Filter data based on active buttons and selected source/target
    const filteredData = data.filter(d => 
        activeButtons.has(d.type) &&
        (sourceSelect === 'all' || d.source === sourceSelect) &&
        (targetSelect === 'all' || d.target === targetSelect)
    );
    
    let allSources = new Set(data.map(d => d.source));
    let filteredTargets = new Set(filteredData.map(d => d.target));
    let toAddToFiltered = [];

    if (!isObjectEmpty(sourceToAdd)) {
        const { id: sourceToAddId } = sourceToAdd;
        allSources.add(sourceToAddId);
        filteredTargets.delete(sourceToAddId);

        // Find initial data entries matching the new source
        toAddToFiltered = initialData.filter(d => d.source === sourceToAddId);
    }

    // Merge filtered data with new entries
    const finalFilteredData = [...filteredData, ...toAddToFiltered];
    
    // Find sources not active but still in the graph
    const sourcesNotActiveButInGraph = Array.from(allSources).filter(source => filteredTargets.has(source));

    // Clear existing graph elements
    svg.selectAll('*').remove();

    // Create the graph with the filtered data
    createGraph(finalFilteredData, initialData, sourcesNotActiveButInGraph);
}

export { refreshGraph };
