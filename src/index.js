const jsonFilePath = "data/mergedDatasetWithToInvestigateExtraData.json";

import * as d3 from "d3";
import { addTypeButtonsEventListeners } from "./modules/buttons";
import { createGraph } from "./modules/createGraph";
import {
    createActiveButtons,
    setCurrentData,
    setInitialData
} from "./modules/dataManagement";
import { addDropdownEventListeners, populateSelect } from "./modules/populateSelect";
import { getUniqueItemsPerKey } from "./modules/utils";

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
