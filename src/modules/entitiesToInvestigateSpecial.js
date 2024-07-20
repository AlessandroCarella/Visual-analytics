import { companiesToInvestigate, companiesToInvestigateExtraInfo, companiesToInvestigateTypeOfLink, selectDefaultValue } from "./constants"
import { getCurrentData, getSelectedSource, getSelectedTarget } from "./dataManagement"

function addLinksBetweenEntitesToInvestigate(dataToAddTo, nodes, idOfNodesToAdd = companiesToInvestigate, typeOfLinkToAdd = companiesToInvestigateTypeOfLink){
    //this function adds links between nodes
    //idOfNodesToAdd needs to be an array and every combination of the ids in the array will be 
    //the default type of link to add is "toInvestigate"
    if ((getSelectedSource() === selectDefaultValue) || (getSelectedTarget() === selectDefaultValue)){
        Array.from(idOfNodesToAdd).forEach(outerElem => {
            Array.from(idOfNodesToAdd).forEach(innerElem => {
                if (outerElem !== innerElem){
                    dataToAddTo.push({
                        source: nodes.find(node => outerElem === node.id),
                        target: nodes.find(node => innerElem === node.id),
                        typeOfLink: typeOfLinkToAdd,
                        weight: 1
                    })
                }
            })  
        })
        return dataToAddTo;
    }
    return dataToAddTo;
}

export { addLinksBetweenEntitesToInvestigate }