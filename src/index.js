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
import { setupButtonControlsInvestigateDistance } from "./modules/investigateDistance";

const jsonFilePathForMergedDatasetWithToInvestigateExtraData = "data/mergedDatasetWithToInvestigateExtraData.json";
const jsonFilePathForConnectionsLevelsSouspectSourcesNoRepetition = "data/connectionsLevelsSouspectSourcesNoRepetition.json";
const jsonFilePathForConnectionsLevelsSouspectTargetsNoRepetition = "data/connectionsLevelsSouspectTargetsNoRepetition.json";

const svg = d3.select('.graph svg');

Promise.all([
    d3.json(jsonFilePathForMergedDatasetWithToInvestigateExtraData),
    d3.json(jsonFilePathForConnectionsLevelsSouspectSourcesNoRepetition),
    d3.json(jsonFilePathForConnectionsLevelsSouspectTargetsNoRepetition)
])
.then(([mergedDatasetWithToInvestigateExtraData, connectionsLevelsSouspectSourcesNoRepetition, connectionsLevelsSouspectTargetsNoRepetition]) => {
    // data
    mergedDatasetWithToInvestigateExtraData = new Set(mergedDatasetWithToInvestigateExtraData);

    setInitialData(mergedDatasetWithToInvestigateExtraData);
    setCurrentData(mergedDatasetWithToInvestigateExtraData);

    createActiveButtons();

    console.log('Connections Levels Sources:', connectionsLevelsSouspectSourcesNoRepetition);
    console.log('Connections Levels Targets:', connectionsLevelsSouspectTargetsNoRepetition);

    // selects
    populateSelect("#source-select", getUniqueItemsPerKey("source").sort());
    populateSelect("#target-select", getUniqueItemsPerKey("target").sort());

    addDropdownEventListeners("#source-select");
    addDropdownEventListeners("#target-select");

    // investigate distance
    setupButtonControlsInvestigateDistance('decrease-source', 'increase-source', 'sourceNumberInput', -1, 7);
    setupButtonControlsInvestigateDistance('decrease-target', 'increase-target', 'targetNumberInput', -1, 8);

    // buttons
    addTypeButtonsEventListeners();
})
.catch((error) => console.error("Error loading the data:", error));

export { svg };
