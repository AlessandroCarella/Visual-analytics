import * as d3 from "d3";
import { resetSelectedSource, resetSelectedTarget, selectDefaultValue, setSelectedSource, setSelectedTarget, } from "./dataManagement";
import { refreshGraph } from "./refreshGraph";
import { companiesToInvestigateSelectVal, companiesToInvestigateText, selectDefaultValueText, sourceSelectTag, targetSelectTag } from "./constants";

function populateSelect(idSelect, items) {
    const dropdown = d3.select(idSelect);
    //remove all the options from the selects
    dropdown
        .selectAll('option')
        .remove();

    //add the "all" option
    dropdown
       .append('option')
       .attr('value', selectDefaultValue)
       .text(selectDefaultValueText);

    //add the to investigate nodes
    dropdown
       .append('option')
       .attr('value', companiesToInvestigateSelectVal)
       .text(companiesToInvestigateText);

    //add the actual options
    items.forEach(item =>
        dropdown
            .append('option')
            .attr('value', item)
            .text(item)
    );

    //set all as the default value
    dropdown.property('value', selectDefaultValue);
}

function addDropdownEventListeners(idSelect) {
    d3.select(idSelect).on('change', function () {
        handleDropdownChange(this.value);
    });
}

function handleDropdownChange(selectedValue) {
    var selectedSource = d3.select(sourceSelectTag).property('value')
    var selectedTarget = d3.select(targetSelectTag).property('value')

    //if the source has been changed
    if (selectedSource === selectedValue) {
        d3.select(targetSelectTag).property('value', selectDefaultValue);
        resetSelectedTarget();
        setSelectedSource(selectedSource)
    }

    // if the target has been changed
    else if (selectedTarget === selectedValue) {
        d3.select(sourceSelectTag).property('value', selectDefaultValue);
        resetSelectedSource();
        setSelectedTarget(selectedTarget);
    }
    
    //else reset everything, should never go here
    else {
        d3.select(sourceSelectTag).property('value', selectDefaultValue);
        resetSelectedSource();
        d3.select(targetSelectTag).property('value', selectDefaultValue);
        resetSelectedTarget();
    }

    refreshGraph();
}

export { populateSelect, addDropdownEventListeners }