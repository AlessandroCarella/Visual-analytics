import * as d3 from "d3";
import { addTypeButtonsEventListeners } from "./modules/buttons";
import {
    createActiveButtons,
    setCurrentData,
    setInitialData,
    setInitialDataInvestigateDistanceSource,
    setInitialDataInvestigateDistanceTarget
} from "./modules/dataManagement";
import { addDropdownEventListeners, populateSelect } from "./modules/populateSelect";
import { getUniqueItemsPerKey } from "./modules/utils";
import { setupInvestigateDistanceElements } from "./modules/investigateDistance";

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

    setInitialDataInvestigateDistanceSource(connectionsLevelsSouspectSourcesNoRepetition);
    setInitialDataInvestigateDistanceTarget(connectionsLevelsSouspectTargetsNoRepetition);

    // buttons
    createActiveButtons();

    // selects
    populateSelect("#source-select", getUniqueItemsPerKey("source").sort());
    populateSelect("#target-select", getUniqueItemsPerKey("target").sort());

    addDropdownEventListeners("#source-select");
    addDropdownEventListeners("#target-select");

    // investigate distance
    setupInvestigateDistanceElements('decrease-source', 'increase-source', 'sourceNumberInput', -1, 7);
    setupInvestigateDistanceElements('decrease-target', 'increase-target', 'targetNumberInput', -1, 6);

    // buttons
    addTypeButtonsEventListeners();
})
.catch((error) => console.error("Error loading the data:", error));

export { svg };
