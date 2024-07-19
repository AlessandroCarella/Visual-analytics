import * as d3 from "d3";
import { activeButtons } from "../index";
import { getTypesOfLinks, updateActiveButtons } from "./dataManagement";
import { activeButtonClass, inactiveButtonClass } from "./constants";
import { refreshGraph } from "./refreshGraph";

function addTypeButtonsEventListeners() {
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

            refreshGraph();
        });
    });
}

export { addTypeButtonsEventListeners };
