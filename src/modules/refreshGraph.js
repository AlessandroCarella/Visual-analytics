// refreshGraph.js
import * as d3 from 'd3';
import { svg } from '../index';
import { createGraph } from './createGraph';
import { updateCurrentDataBasedOnButtons, updateCurrentDataBasedOnInvestigateDistanceValues, updateCurrentDataBasedOnSelect, updateCurrentDataWithNewNodes } from './dataManagement';


function refreshGraph() {
    d3.selectAll('div-tooltip.tooltip').style('opacity', 0); // Hide tooltip on click

    //this is the most general update because it is based on the values 
    //selected in the select boxes and the initial data 
    updateCurrentDataBasedOnSelect();

    //also this update is based on the initial data but to add values
    //based on the nodes, so it comes AFTER the SELECT UPDATE
    updateCurrentDataWithNewNodes();

    //this updates based on the other 2 files so the handled data is 
    //different from the 2 previous functions, therfore it comes after
    //the buttons still come later because the user might want to filter
    //the connections based on that
    updateCurrentDataBasedOnInvestigateDistanceValues();

    //this is a filter on the current data so it has to come after the 
    //other functions that work on the initial datas
    updateCurrentDataBasedOnButtons();

    //TODO replace the next 2 methods (svg.selectAll.remove and createGraph)
    //with 3 methods
    //find difference (currentData, previousCurrentData)
    //remove excess data
    //add missing data

    // Clear existing graph elements
    svg.selectAll('*').remove();

    // Create the graph with the filtered data
    createGraph();
}

export { refreshGraph };
