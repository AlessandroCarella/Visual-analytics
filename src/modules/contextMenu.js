import { addNodeToAddedNodes, clickableNode, getAddedNodes, setLastAddedNodeId } from "./dataManagement";
import { refreshGraph } from "./refreshGraph";

const contextMenu = d3.select("#context-menu");

function showContextMenu(event, d) {
    contextMenu.style("display", "block")
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY}px`);

    contextMenu.selectAll(".context-menu__item")
        .on("click", function() {
            const option = d3.select(this).attr("data-option");
            handleMenuOption(event, d, option);
            contextMenu.style("display", "none");
        });

    d3.select("body").on("click", () => {
        contextMenu.style("display", "none");
    });
}

function handleMenuOption(event, node, option) {
   if (clickableNode(node, option)) {
        addNodeToAddedNodes(node, option);
        setLastAddedNodeId(node.id);
        refreshGraph();
    }
}

export { showContextMenu };