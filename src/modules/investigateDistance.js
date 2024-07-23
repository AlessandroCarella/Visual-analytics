import * as d3 from "d3";
import { companiesToInvestigate, idSelectInvestigate, selectAllNodesText, selectAllNodesVal, selectEmptyVal } from "./constants";
import { resetBothValueInvestigateDistance, resetOtherInputFromInvestigateDistance, resetSelectedSource, resetSelectedTarget, resetSourceValueInvestigateDistance, resetTargetValueInvestigateDistance, setSelectedValueInvestigate } from "./dataManagement";
import { refreshGraph } from "./refreshGraph";

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function setupInvestigateDistanceElements(decreaseButtonId, increaseButtonId, inputId, minValue, maxValue) {
    const input = document.getElementById(inputId);
    const decreaseButton = document.getElementById(decreaseButtonId);
    const increaseButton = document.getElementById(increaseButtonId);
    let previousValue = parseInt(input.value);

    function validateAndStore() {
        let value = parseInt(input.value);
        if (isNaN(value) || value < minValue || value > maxValue) {
            input.value = previousValue;
        } else {
            previousValue = value;
        }
    }

    // Create a debounced version of the refreshGraph function
    const debouncedRefreshGraph = debounce(() => {
        resetOtherInputFromInvestigateDistance(inputId);  // Reset the other input when changed
        refreshGraph();
    }, 300); // 300ms delay

    decreaseButton.addEventListener('click', () => {
        let value = parseInt(input.value);
        if (value > minValue) {
            input.value = value - 1;
            validateAndStore();
            debouncedRefreshGraph();  // Use the debounced function
        }
    });

    increaseButton.addEventListener('click', () => {
        let value = parseInt(input.value);
        if (value < maxValue) {
            input.value = value + 1;
            validateAndStore();
            debouncedRefreshGraph();  // Use the debounced function
        }
    });
}

//////////////////////////////////////////////

function populateSelectInvestigate() {
    let dropdown = d3.select(idSelectInvestigate);

    // Remove all the options from the select
    dropdown
        .selectAll('option')
        .remove();

    // Add the "all" option
    dropdown
        .append('option')
        .attr('value', selectAllNodesVal)
        .text(selectAllNodesText);

    // Add the actual options
    companiesToInvestigate.forEach(item => {
        dropdown
            .append('option')
            .attr('value', item)
            .text(item);
    });

    // Set "all" as the selected value
    dropdown.property('value', selectEmptyVal);
}

function addDropdownEventListenersInvestigate() {
    d3.select(idSelectInvestigate).on('change', function () {
        handleDropdownChangeInvestigate(this.value);
    });
}

function handleDropdownChangeInvestigate(selectedValue) {
    setSelectedValueInvestigate(selectedValue);

    //change the values in the investigate distance boxes
    resetSourceValueInvestigateDistance()
    resetTargetValueInvestigateDistance()
    resetBothValueInvestigateDistance()

    //reset values in the selects
    resetSelectedSource()
    resetSelectedTarget()

    // Refresh the graph to reflect the changes made
    refreshGraph();
}

export { addDropdownEventListenersInvestigate, populateSelectInvestigate, setupInvestigateDistanceElements };
