import * as d3 from "d3";
import { companiesToInvestigateSelectVal, companiesToInvestigateText, selectAllNodesText, selectAllNodesVal, selectEmptyText, selectEmptyVal, sourceSelectTag, targetSelectTag } from "./constants";
import { getSelectedSource, getSelectedTarget, resetAddedNodes, resetBothValueInvestigateDistance, resetSelectedSource, resetSelectedTarget, resetSelectedValueInvestigate, resetSourceValueInvestigateDistance, resetTargetValueInvestigateDistance, setSelectedSource, setSelectedTarget, } from "./dataManagement";
import { refreshGraph } from "./refreshGraph";

function populateSelect(idSelect, items) {
    const dropdown = d3.select(idSelect);
    //remove all the options from the selects
    dropdown
        .selectAll('option')
        .remove();

    //add the empty option
    dropdown
        .append('option')
        .attr('value', selectEmptyVal)
        .text(selectEmptyText);

    //add the "to investigate nodes" nodes
    dropdown
        .append('option')
        .attr('value', companiesToInvestigateSelectVal)
        .text(companiesToInvestigateText);

    //add the "all" option
    dropdown
        .append('option')
        .attr('value', selectAllNodesVal)
        .text(selectAllNodesText);

    //add the actual options
    items.forEach(item =>
        dropdown
            .append('option')
            .attr('value', item)
            .text(item)
    );

    //set all as the entities to investigate value
    dropdown.property('value', selectEmptyVal);
}

function addDropdownEventListeners(idSelect) {
    d3.select(idSelect).on('change', function () {
        handleDropdownChange(this.value);
    });
}

function handleDropdownChange(selectedValue) {
    // Retrieve the currently selected values from the dropdown menus
    var selectedSource = d3.select(sourceSelectTag).property('value');
    var selectedTarget = d3.select(targetSelectTag).property('value');

    // Retrieve the previously selected values stored in the data management file
    var previouslySelectedSource = getSelectedSource();
    var previouslySelectedTarget = getSelectedTarget();

    // Check if the newly selected value matches the previously selected source
    if (previouslySelectedSource === selectedSource) {
        // If the selected source is the same as the previous source, reset the selected source
        // and set the new selected value as the target
        resetSelectedSource();
        setSelectedTarget(selectedValue);
    }
    // Check if the newly selected value matches the previously selected target
    else if (previouslySelectedTarget === selectedTarget) {
        // If the selected target is the same as the previous target, reset the selected target
        // and set the new selected value as the source
        resetSelectedTarget();
        setSelectedSource(selectedValue);
    }
    else {
        // If the source dropdown value has changed
        if (selectedSource === selectedValue) {
            // Reset the target selection and set the source back to the original selected source
            resetSelectedTarget();
            setSelectedSource(selectedSource);
        }
        // If the target dropdown value has changed
        else if (selectedTarget === selectedValue) {
            // Reset the source selection and set the target back to the original selected target
            resetSelectedSource();
            setSelectedTarget(selectedTarget);
        }
        // If none of the conditions match, reset both selections (shouldn't occur in normal cases)
        else {
            resetSelectedSource();
            resetSelectedTarget();
        }
    }

    //Reset the added nodes
    resetAddedNodes();
    
    resetSelectedValueInvestigate();
    //change the values in the investigate distance boxes
    resetSourceValueInvestigateDistance()
    resetTargetValueInvestigateDistance()
    resetBothValueInvestigateDistance()

    // Refresh the graph to reflect the changes made
    refreshGraph();
}

export { addDropdownEventListeners, populateSelect };
