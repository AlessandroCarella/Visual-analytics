// refreshGraph.js
import * as d3 from 'd3';
import { svg } from '../index';
import { createGraph, createNodesAndLinks, simulation } from './createGraph';
import { getAddedNodes, getCurrentData, getInitialData, updateCurrentDataBasedOnButtons, updateCurrentDataBasedOnInvestigateDistanceValues, updateCurrentDataBasedOnSelect, updateCurrentDataWithNewNodes } from './dataManagement';
import { createLinks, createNodes } from './createGraphHelpers/createEntities';
import { findPerSourceNumberOfTargetsOrOpposite } from './utils';
import { initializeSimulation } from './createGraphHelpers/simulation';

function findDataDelta(previousData, currentData) {
    const addedData = new Set([...currentData].filter(x => !previousData.has(x)));
    const removedData = new Set([...previousData].filter(x => !currentData.has(x)));

    const { nodes:nodesToAdd, links:linksToAdd } = createNodesAndLinks(addedData);
    const { nodes:nodesToRemove, links:linksToRemove } = createNodesAndLinks(removedData);
    
    return { nodesToAdd, linksToAdd, nodesToRemove, linksToRemove };
}

function removeNodes(nodesToRemove) {
    const nodeIdsToRemove = nodesToRemove.map(node => node.id);

    const nodesToRemoveSelection = svg.selectAll('g.node')
        .filter(d => nodeIdsToRemove.includes(d.id));

    nodesToRemoveSelection.remove();
}

function removeLinks(linksToRemove) {
    const linksIdsToRemove = linksToRemove.map(link => link.id);

    const linksToRemoveSelection = svg.selectAll('path.link')
       .filter(d => linksIdsToRemove.includes(d.id));

    linksToRemoveSelection.remove();
}

function updateGraph(nodesToAdd, linksToAdd, nodesToRemove, linksToRemove) {
    const targetsPerSourceCount = findPerSourceNumberOfTargetsOrOpposite(getInitialData(), "source");
    const sourcesPerTargetCount = findPerSourceNumberOfTargetsOrOpposite(getInitialData(), "target");

    if (typeof simulation === 'undefined') {
        createGraph();
        return;
    }

    removeLinks(linksToRemove);
    removeNodes(nodesToRemove);

    // Create and append new links and nodes
    createLinks(linksToAdd);
    createNodes(nodesToAdd, targetsPerSourceCount, sourcesPerTargetCount, simulation);

    // Remove deleted nodes and links from simulation
    simulation.nodes(simulation.nodes().filter(d => !nodesToRemove.some(node => node.id === d.id)));
    simulation.force('link').links(simulation.force('link').links().filter(d => !linksToRemove.some(link => link.id === d.id)));
    
    // Update simulation nodes and links
    simulation.nodes(simulation.nodes().concat(nodesToAdd));
    simulation.force('link').links(simulation.force('link').links().concat(linksToAdd));

    // Restart the simulation
    //simulation.alpha(0.3).restart();
}

function refreshGraph() {
    const previousCurrentData = getCurrentData();
    d3.selectAll('div-tooltip.tooltip').style('opacity', 0); // Hide tooltip on click

    //this is the most general update because it is based on the values 
    //selected in the select boxes and the initial data 
    updateCurrentDataBasedOnSelect();

    //this updates based on the other 2 files so the handled data is 
    //different from the 2 previous functions, therfore it comes after
    //the buttons still come later because the user might want to filter
    //the connections based on that
    updateCurrentDataBasedOnInvestigateDistanceValues();

    //also this update is based on the initial data but to add values
    //based on the nodes, so it comes AFTER the SELECT UPDATE
    updateCurrentDataWithNewNodes();
        
    //this is a filter on the current data so it has to come after the 
    //other functions that work on the initial datas
    updateCurrentDataBasedOnButtons();

    //update or update the graph (not working)
    // const { nodesToAdd, linksToAdd, nodesToRemove, linksToRemove } = findDataDelta(previousCurrentData, getCurrentData());
    
    // if (nodesToAdd.length === 0 && linksToAdd.length === 0 && nodesToRemove.length === 0 && linksToRemove.length === 0)
    //     createGraph();
    // else    
    //     updateGraph(nodesToAdd, linksToAdd, nodesToRemove, linksToRemove);

    // Clear existing graph elements
    svg.selectAll('*').remove();

    // Create the graph with the filtered data
    createGraph();
}

export { refreshGraph };
