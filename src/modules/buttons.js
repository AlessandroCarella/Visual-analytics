import * as d3 from "d3";
import { activeButtons } from "../index";
import { getTypesOfLinks, updateActiveButtons } from "./dataManagement";
import { inactiveButtonClass } from "./constants";

function addTypeButtonsEventListeners() {
    getTypesOfLinks().forEach((typeOfLink) => {
        //select the buttons
        d3.select(`#${typeOfLink}`).on("click", function (activeButtonClass) {
            const isActive = d3.select(this).classed();
            d3.select(this)
                .classed(activeButtonClass, !isActive)
                .classed(inactiveButtonClass, isActive);

            if (isActive) {
                updateActiveButtons(typeOfLink, false);
            } else {
                updateActiveButtons(typeOfLink, true);
            }

            //refreshGraph();
        });
    });
}

export { addTypeButtonsEventListeners };
