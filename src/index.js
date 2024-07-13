const jsonFilePath = "data/edgesCleanWithCoordinates.json";

import * as d3 from "d3";
import { createGraph } from "./modules/createGraph";
import { refreshGraph } from "./modules/refreshGraph";
import {
    populateSelect,
    addDropdownEventListeners,
} from "./modules/populateSelect";
import { addTypeButtonsEventListeners } from "./modules/buttons";
import { getUniqueItems } from "./modules/utils";

const width = 1399;
const height = 888;

const types = ["ownership", "partnership", "family_relationship", "membership"];
var source = "all";
var target = "all";

var activeButtons = new Set(types);

const svg = d3.select("svg");

const color = d3
    .scaleOrdinal()
    .domain(types)
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

d3.json(jsonFilePath)
    .then((data) => {
        const uniqueSources = getUniqueItems(data, "source");
        const uniqueTargets = getUniqueItems(data, "target");

        populateSelect("#source-select", uniqueSources);
        populateSelect("#target-select", uniqueTargets);

        addDropdownEventListeners(data);

        createGraph(data);
        addTypeButtonsEventListeners(data);
    })
    .catch((error) => console.error("Error loading the data:", error));

export { types, activeButtons, svg, color };
