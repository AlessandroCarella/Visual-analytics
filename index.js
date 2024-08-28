import * as d3 from 'd3';

import { addTypeButtonsEventListeners } from "./modules/buttons";
import {
    createActiveButtons,
    setCurrentData,
    setInitialData,
    setInitialDataInvestigateDistanceSource,
    setInitialDataInvestigateDistanceTarget
} from "./modules/dataManagement";
import { addDropdownEventListenersInvestigate, populateSelectInvestigate, setupInvestigateDistanceElements } from "./modules/investigateDistance";
import { addDropdownEventListeners, populateSelect } from "./modules/populateSelect";
import { getUniqueItemsPerKey } from "./modules/utils";
import { setupGuideButton } from "./modules/guide";
import { preloadSvgs } from "./modules/createGraphHelpers/createEntities";
import { setupOpacitySlider } from './modules/opacitySlider';

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
        setCurrentData(new Set());

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
        populateSelectInvestigate()
        addDropdownEventListenersInvestigate()

        setupInvestigateDistanceElements('decrease-source', 'increase-source', 'sourceNumberInput', -1, 7);
        setupInvestigateDistanceElements('decrease-target', 'increase-target', 'targetNumberInput', -1, 6);
        setupInvestigateDistanceElements('decrease-both', 'increase-both', 'bothNumberInput', -1, 7);

        // buttons
        addTypeButtonsEventListeners();

        //guide
        preloadSvgs().then(() => {
            setupGuideButton()
        });

        //opacity slider
        setupOpacitySlider();
    })
    .catch((error) => console.error("Error loading the data:", error));

export { svg };
