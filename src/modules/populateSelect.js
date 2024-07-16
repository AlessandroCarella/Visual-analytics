import * as d3 from "d3";
import { refreshGraph } from "./refreshGraph";

function populateSelect(selector, items) {
    const dropdown = d3.select(selector);
    dropdown.selectAll('option').remove();
    dropdown.append('option').attr('value', 'all').text('All');
    items.forEach(item => dropdown.append('option').attr('value', item).text(item));
    dropdown.property('value', 'all');
}

function addDropdownEventListeners(data) {
    d3.select('#source-select').on('change', function () {
        handleDropdownChange(this.value, 'source', data);
    });

    d3.select('#target-select').on('change', function () {
        handleDropdownChange(this.value, 'target', data);
    });
}

function handleDropdownChange(selectedValue, type, data) {
    var selectedSource = d3.select(`#source-select`).property('value')
    var selectedTarget = d3.select(`#target-select`).property('value')

    //if the source has been changed
    if (selectedSource === selectedValue) {
        d3.select(`#target-select`).property('value', 'all');
    }
    // if the target has been changed
    else if (selectedTarget === selectedValue) {
        d3.select(`#source-select`).property('value', 'all');
    }
    //else reset everything
    else {
        d3.select(`#source-select`).property('value', 'all');
        d3.select(`#target-select`).property('value', 'all');
    }

    //check index.js for why passing data twice
    refreshGraph(data);
}

export { populateSelect, addDropdownEventListeners }