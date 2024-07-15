import * as d3 from "d3";
import { types, activeButtons } from "../index";
import { refreshGraph } from "./refreshGraph";

function addTypeButtonsEventListeners(data) {
    types.forEach((type) => {
        d3.select(`#${type}`).on("click", function () {
            const isActive = d3.select(this).classed("active-button");
            d3.select(this)
                .classed("active-button", !isActive)
                .classed("inactive-button", isActive);

            if (isActive) {
                activeButtons.delete(type);
            } else {
                activeButtons.add(type);
            }

            //check index.js for why passing data twice
            refreshGraph(data, data);
        });
    });
}

export { addTypeButtonsEventListeners };
