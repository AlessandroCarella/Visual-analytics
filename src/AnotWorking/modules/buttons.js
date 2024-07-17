import * as d3 from "d3";
import { activeButtons } from "../index";
import { refreshGraph } from "./refreshGraph";
import { getTypesOfLinks, updateActiveButtons } from "./dataManagement";

function addTypeButtonsEventListeners() {
    getTypesOfLinks().forEach((type) => {
        d3.select(`#${type}`).on("click", function () {
            const isActive = d3.select(this).classed("active-button");
            d3.select(this)
                .classed("active-button", !isActive)
                .classed("inactive-button", isActive);

            if (isActive) {
                updateActiveButtons(type, false);
            } else {
                updateActiveButtons(type, true);
            }

            refreshGraph();
        });
    });
}

export { addTypeButtonsEventListeners };
