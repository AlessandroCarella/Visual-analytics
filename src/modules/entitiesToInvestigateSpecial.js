import { companiesToInvestigate, companiesToInvestigateExtraInfo, companiesToInvestigateSelectVal, companiesToInvestigateTypeOfLink, selectDefaultValue } from "./constants"
import { getCurrentData, getSelectedSource, getSelectedTarget } from "./dataManagement"

let specialAddedLinks = new Set ()

function getSpecialAddedLinks(){
    return specialAddedLinks;
}

function resetSpecialAddedLinks(){
    specialAddedLinks = new Set ();
}

function addLinksBetweenEntitesToInvestigate(dataToAddTo, nodes, idOfNodesToAdd = companiesToInvestigate, typeOfLinkToAdd = companiesToInvestigateTypeOfLink){
    //this function adds links between nodes
    //idOfNodesToAdd needs to be an array and every combination of the ids in the array will be 
    //the default type of link to add is "toInvestigate"
    if ((getSelectedSource() === companiesToInvestigateSelectVal) || (getSelectedTarget() === companiesToInvestigateSelectVal)){
        Array.from(idOfNodesToAdd).forEach(outerElem => {
            Array.from(idOfNodesToAdd).forEach(innerElem => {
                if (outerElem !== innerElem){
                    const elemToAdd = {
                        source: nodes.find(node => outerElem === node.id),
                        target: nodes.find(node => innerElem === node.id),
                        typeOfLink: typeOfLinkToAdd,
                        weight: 0.001
                    }
                    dataToAddTo.push(elemToAdd);
                    specialAddedLinks.add(elemToAdd)
                }
            })  
        })
        return dataToAddTo;
    }
    return dataToAddTo;
}

export { 
    addLinksBetweenEntitesToInvestigate, 
    getSpecialAddedLinks, resetSpecialAddedLinks 
}