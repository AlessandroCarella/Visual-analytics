import * as d3 from "d3";
import { getInitialData, resetAndAddElemSelectedSources, resetAndAddElemSelectedTargets, resetSelectedSources, resetSelectedTargets } from "./dataManagement";

function populateSelect(idSelect, items) {
    const dropdown = d3.select(idSelect);
    //remove all the options from the selects
    dropdown
        .selectAll('option')
        .remove();
    //add the "all" option
    dropdown
        .append('option')
        .attr('value', 'all')
        .text('All');

    //add the actual options
    items.forEach(item =>
        dropdown
            .append('option')
            .attr('value', item)
            .text(item)
    );

    //set all as the default value
    dropdown.property('value', 'all');
}

function addDropdownEventListeners(idSelect) {
    d3.select(idSelect).on('change', function () {
        handleDropdownChange(this.value);
    });
}

function handleDropdownChange(selectedValue) {
    var selectedSource = d3.select(`#source-select`).property('value')
    var selectedTarget = d3.select(`#target-select`).property('value')

    //if the source has been changed
    if (selectedSource === selectedValue) {
        d3.select(`#target-select`).property('value', 'all');
        resetAndAddElemSelectedSources(selectedSource);
        resetSelectedTargets();
    }
    // if the target has been changed
    else if (selectedTarget === selectedValue) {
        d3.select(`#source-select`).property('value', 'all');
        resetAndAddElemSelectedTargets(selectedTarget);
        resetSelectedSources();
    }
    //else reset everything, should never go here
    else {
        d3.select(`#source-select`).property('value', 'all');
        resetSelectedSources();
        d3.select(`#target-select`).property('value', 'all');
        resetSelectedTargets();
    }

    //refreshGraph();
}

export { populateSelect, addDropdownEventListeners }