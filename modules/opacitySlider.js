import { setNonHighlightedNodeOpacity } from './createGraphHelpers/graphConstants';
import { getCurrentlyClickedId } from './dataManagement';

function setupOpacitySlider() {
    const slider = document.getElementById('opacity-slider');
    const valueDisplay = document.getElementById('opacity-value');
    
    // Create the tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'slider-tooltip';
    tooltip.textContent = 'The slider is disabled when a node is selected';
    
    // Append the tooltip to the slider's parent
    slider.parentNode.appendChild(tooltip);

    let lastValidValue = slider.value;

    slider.addEventListener('input', function() {
        if (getCurrentlyClickedId() === null) {
            const value = parseInt(this.value);
            setNonHighlightedNodeOpacity(value / 10);
            valueDisplay.textContent = value;
            lastValidValue = this.value;
            tooltip.classList.remove('slider-tooltip-visible');
        } else {
            this.value = lastValidValue; // Revert the slider position
            tooltip.classList.add('slider-tooltip-visible');
        }
        console.log('Slider input event, tooltip visibility:', tooltip.classList.contains('slider-tooltip-visible'));
    });
}

export { setupOpacitySlider };