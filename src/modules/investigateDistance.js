import { resetOtherInputFromInvestigateDistance } from "./dataManagement";
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

export {
    setupInvestigateDistanceElements
};
