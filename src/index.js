const jsonFilePath = "data/mergedDatasetWithToInvestigateExtraData.json";

import { addTypeButtonsEventListeners } from "./modules/buttons";
import { createGraph } from "./modules/createGraph";
import {
    createActiveButtons,
    generateInitialDictNodeToTypeCountry,
    generateInitialLinksData,
    generateInitialNodesData,
    generateInitialSourcesANDtargetsANDsourcesTargetsANDTargetsSources,
    setCurrentData,
    setInitialData,
    setUpTargetsPerSourceCountAndViceversa,
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
        ////data generation for the graph when initial data is selected
        /**/setUpTargetsPerSourceCountAndViceversa();
        /**/generateInitialSourcesANDtargetsANDsourcesTargetsANDTargetsSources()
        /**/generateInitialDictNodeToTypeCountry();
        /**/generateInitialNodesData();
        /**/generateInitialLinksData();
        createGraph();

        //buttons
        addTypeButtonsEventListeners();
    })
    .catch((error) => console.error("Error loading the data:", error));

export { svg };
