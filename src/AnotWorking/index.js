const jsonFilePath = "data/mergedDatasetCut.json";

import * as d3 from "d3";
import { setInitialData, setCurrentData, getCurrentData, createActiveButtons, createTypesOfLinks} from "./modules/dataManagement"
import { createGraph, setInitialDataCreateGraph } from "./modules/createGraph";
import {
    populateSelect,
    addDropdownEventListeners,
} from "./modules/populateSelect";
import { addTypeButtonsEventListeners } from "./modules/buttons";
import { getUniqueItems } from "./modules/utils";


const svg = d3.select('.graph svg');

const color = d3
    .scaleOrdinal()
    .domain(typesOfLinks)
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

d3.json(jsonFilePath)
    .then((data) => {
        setInitialData(data)
        setCurrentData(data)

        createTypesOfLinks()
        createActiveButtons()


        populateSelect("#source-select", getUniqueItems("source").sort());
        populateSelect("#target-select", getUniqueItems("target").sort());

        addDropdownEventListeners();

        createGraph();
        addTypeButtonsEventListeners();
    })
    .catch((error) => console.error("Error loading the data:", error));

export { typesOfLinks, activeButtons, svg, color };
