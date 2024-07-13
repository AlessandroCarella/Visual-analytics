import * as d3 from "d3";
import { types, svg, color, activeButtons } from "../index";
import { findNumberOfTargets, cleanSet } from "./utils";
import { dragstarted, dragged, dragended } from "./graphUtil";

function refreshGraph(data, activeSources) {
    console.log("refreshing graph");
    const selectedSource = d3.select(`#source-select`).property('value');
    const selectedTarget = d3.select(`#target-select`).property('value');
    const activeTypes = Array.from(activeButtons);

    const filteredData = data.filter(d =>
        (d.source === selectedSource || selectedSource === 'all') &&
        (d.target === selectedTarget || selectedTarget === 'all')
    );

    let activeTargets = Array.from(new Set(filteredData.map(d => d.target)));
    activeTargets = cleanSet(activeTargets, activeSources);

    const activeLinks = filteredData.filter(d =>
        activeSources.includes(d.source) &&
        activeTargets.includes(d.target) &&
        activeTypes.includes(d.type)
    );

    const activeNodes = Array.from(new Set(activeLinks.flatMap(link => [link.source, link.target])));

    svg.selectAll('circle')
        .style('visibility', d => 
            activeNodes.includes(d.id) ? 'visible' : 'hidden'
        );

    svg.selectAll('line.link')
        .style('visibility', d => 
            activeLinks.some(link => link.source === d.source.id && link.target === d.target.id) ? 'visible' : 'hidden'
        );

    svg.selectAll('text')
        .style('visibility', d => 
            activeNodes.includes(d.id) ? 'visible' : 'hidden'
        );
}

export { refreshGraph };
