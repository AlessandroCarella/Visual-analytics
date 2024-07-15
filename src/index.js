const jsonFilePath = "data/edgesCleanWithCoordinatesNoDeadEnds.json";

import * as d3 from "d3";
import { createGraph } from "./modules/createGraph";
import { refreshGraph } from "./modules/refreshGraph";
import {
    populateSelect,
    addDropdownEventListeners,
} from "./modules/populateSelect";
import { addTypeButtonsEventListeners } from "./modules/buttons";
import { getUniqueItems } from "./modules/utils";

const types = ["ownership", "partnership", "family_relationship", "membership"];
var source = "all";
var target = "all";

var activeButtons = new Set(types);

const svg = d3.select('.graph svg');

const color = d3
    .scaleOrdinal()
    .domain(types)
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

d3.json(jsonFilePath)
    .then((data) => {
        const uniqueSources = getUniqueItems(data, "source").sort();
        const uniqueTargets = getUniqueItems(data, "target").sort();

        populateSelect("#source-select", uniqueSources);
        populateSelect("#target-select", uniqueTargets);

        addDropdownEventListeners(data);

        //the createGraph function takes 3 inputs data, initialData and sourcesNotActiveButInGraph
        //data is the data that will be modified to plot the variations of the graph
        //
        //initial data is needed because, when one of the nodes that is a source on the graph but 
        //doesn't have its target plotted the info about the links from this source where removed 
        //by the data so the program needs the initial data state to retrieve those
        //
        //sourcesNotActiveButInGraph is a non required parameter, but it's used when the data has
        //been filtered and the program needs to find the nodes that are a non active source to 
        //plot them in a different color
        //
        //so, since here the graph is been created for the first time, the initial data is the same 
        //as data
        createGraph(data, data);
        addTypeButtonsEventListeners(data);
    })
    .catch((error) => console.error("Error loading the data:", error));

export { types, activeButtons, svg, color };
