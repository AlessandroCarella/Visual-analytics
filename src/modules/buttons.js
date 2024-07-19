import * as d3 from "d3";
import { activeButtons } from "../index";
import { getActiveButtons, getTypesOfLinks, updateActiveButtons } from "./dataManagement";
import { activeButtonClass, inactiveButtonClass } from "./constants";
import { refreshGraph } from "./refreshGraph";

function addTypeButtonsEventListeners() {
    const beforeActiveButtons = getActiveButtons()
    getTypesOfLinks().forEach((typeOfLink) => {
        //select the buttons
        d3.select(`#${typeOfLink}`).on("click", function () {
            const isActive = d3.select(this).classed(activeButtonClass);
            d3.select(this)
                .classed(activeButtonClass, !isActive)
                .classed(inactiveButtonClass, isActive);

            if (!isActive) {
                updateActiveButtons(typeOfLink, true);
            } else {
                updateActiveButtons(typeOfLink, false);
            }

            console.log(beforeActiveButtons)
            console.log(getActiveButtons())
            console.log(beforeActiveButtons.difference(getActiveButtons()).size > 1)
            if (beforeActiveButtons.difference(getActiveButtons()).size > 1)
                if (newButtonAddsLinks()){
                    refreshGraph();
                }
        });
    });
}

export { addTypeButtonsEventListeners };
