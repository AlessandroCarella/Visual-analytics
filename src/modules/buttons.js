import * as d3 from "d3";
import { activeButtons } from "../index";
import { getTypesOfLinks, updateActiveButtons } from "./dataManagement";

function addTypeButtonsEventListeners() {
    getTypesOfLinks().forEach((typeOfLink) => {
        //select the buttons
        d3.select(`#${typeOfLink}`).on("click", function () {
            console.log(typeOfLink);
            const isActive = d3.select(this).classed("active-button");
            d3.select(this)
                .classed("active-button", !isActive)
                .classed("inactive-button", isActive);

            if (isActive) {
                updateActiveButtons(typeOfLink, false);
            } else {
                updateActiveButtons(typeOfLink, true);
            }

            // refreshGraph();
        });
    });
}

export { addTypeButtonsEventListeners };
