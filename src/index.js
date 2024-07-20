const jsonFilePath = "data/mergedDataset.json";

import * as d3 from "d3";
import {
    setInitialData, setCurrentData, getInitialData,
    createActiveButtons,
    getTypesOfLinks,
    getActiveButtons,
    getCurrentData,
} from "./modules/dataManagement";
import { getUniqueItemsPerKey } from "./modules/utils";
import { addDropdownEventListeners, populateSelect } from "./modules/populateSelect";
import { addTypeButtonsEventListeners } from "./modules/buttons";
import { createGraph } from "./modules/createGraph";

const svg = d3.select('.graph svg');

d3.json(jsonFilePath)
.then((data) => {
    data = new Set(data);
    //data
    setInitialData(data)
    setCurrentData(data)

    createActiveButtons();

    //selects
    populateSelect("#source-select", getUniqueItemsPerKey("source").sort());
    populateSelect("#target-select", getUniqueItemsPerKey("target").sort());

    addDropdownEventListeners("#source-select");
    addDropdownEventListeners("#target-select");

    //graph
    createGraph();

    //buttons
    addTypeButtonsEventListeners();
})
.catch((error) => console.error("Error loading the data:", error));

export { svg };
