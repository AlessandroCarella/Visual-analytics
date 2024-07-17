const jsonFilePath = "data/mergedDatasetCut.json";

import * as d3 from "d3";
import {
    setInitialData, setCurrentData, getInitalData,
    createActiveButtons, createTypesOfLinks,
    getTypesOfLinks,
    getActiveButtons,
    getCurrentData,
} from "./modules/dataManagement";
import { getUniqueItemsPerKey } from "./modules/utils";
import { addDropdownEventListeners, populateSelect } from "./modules/populateSelect";

const svg = d3.select('.graph svg');

d3.json(jsonFilePath)
.then((data) => {
    console.log(data);
        //data
        setInitialData(data)
        setCurrentData(data)

        createTypesOfLinks(data);
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
