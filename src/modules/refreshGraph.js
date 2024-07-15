// refreshGraph.js
import * as d3 from 'd3';
import { svg, color, activeButtons } from '../index';
import { createGraph } from './createGraph';
import { isObjectEmpty } from './utils';

function refreshGraph(data, initialData, sourceToAdd = {}) {    
    console.log ("sourceToAdd", sourceToAdd)
    const sourceSelect = document.querySelector('#source-select').value;
    const targetSelect = document.querySelector('#target-select').value;

    let filteredData = data.filter(d => {
        const isActiveType = activeButtons.has(d.type);
        const isSourceMatch = (sourceSelect === 'all') || (d.source === sourceSelect);
        const isTargetMatch = (targetSelect === 'all') || (d.target === targetSelect);
        return isActiveType && isSourceMatch && isTargetMatch;
    });
    console.log("filteredData before", filteredData)

    let allSources = new Set(data.map(element => element.source));
    
    let filteredTargets = new Set(filteredData.map(element => element.target));
    
    let toAddToFiltered = [];
    if (!isObjectEmpty(sourceToAdd)){
        allSources.add(sourceToAdd.id);
        filteredTargets.delete(sourceToAdd.id);

        for (let i in initialData){
            let d = initialData[i];
            console.log(i, d.source)
            if (d.source === sourceToAdd.id){
                console.log("found source in data", d)
                toAddToFiltered.push(d);
            }
        }
    }
    // Concatenate toAddToFiltered to filteredData
    filteredData = filteredData.concat(toAddToFiltered);
    console.log("filteredData after", filteredData)
    
    //TODO, maybe need to add logic to find non active sources
    const sourcesNotActiveButInGraph = Array.from(new Set([...allSources].filter(element => filteredTargets.has(element))));
    
    // Clear existing graph elements
    svg.selectAll('*').remove();

    // Create the graph with the filtered data
    createGraph(filteredData, initialData, sourcesNotActiveButInGraph);
}

export { refreshGraph };
