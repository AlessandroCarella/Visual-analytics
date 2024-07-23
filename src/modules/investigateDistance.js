import { resetSelectedSource, resetSelectedTarget } from "./dataManagement";
import { refreshGraph } from "./refreshGraph";

function setupButtonControlsInvestigateDistance(decreaseButtonId, increaseButtonId, inputId, minValue, maxValue) {
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

    decreaseButton.addEventListener('click', () => {
        let value = parseInt(input.value);
        if (value > minValue) {
            input.value = value - 1;
            validateAndStore();
            resetOtherInput(inputId);  // Reset the other input when changed
        }
    });

    increaseButton.addEventListener('click', () => {
        let value = parseInt(input.value);
        if (value < maxValue) {
            input.value = value + 1;
            validateAndStore();
            resetOtherInput(inputId);  // Reset the other input when changed
        }
    });
}

function getSourceValueInvestigateDistance() {
    const sourceInput = document.getElementById('sourceNumberInput');
    return parseInt(sourceInput.value);
}

function getTargetValueInvestigateDistance() {
    const targetInput = document.getElementById('targetNumberInput');
    return parseInt(targetInput.value);
}

// Functions to reset the values of the inputs
function resetSourceValueInvestigateDistance() {
    document.getElementById('sourceNumberInput').value = -1;
}

function resetTargetValueInvestigateDistance() {
    document.getElementById('targetNumberInput').value = -1;
}

// Reset the other input based on the current input ID
function resetOtherInput(currentInputId) {
    if (currentInputId === 'sourceNumberInput') {
        resetTargetValueInvestigateDistance();
    } else if (currentInputId === 'targetNumberInput') {
        resetSourceValueInvestigateDistance();
    }

    //select reset
    resetSelectedSource()
    resetSelectedTarget()

    refreshGraph()
}

export { 
    setupButtonControlsInvestigateDistance, 
    getSourceValueInvestigateDistance, getTargetValueInvestigateDistance, 
    resetSourceValueInvestigateDistance, resetTargetValueInvestigateDistance, 
};
