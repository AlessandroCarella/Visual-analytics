import * as d3 from "d3";
import { types, svg, color, activeButtons } from "../index";
import { findNumberOfTargets, cleanSet } from "./utils";
import { dragstarted, dragged, dragended } from "./graphUtil";

function refreshGraph(data) {
    const selectedSource = d3.select(`#source-select`).property('value');
    const selectedTarget = d3.select(`#target-select`).property('value');
    const activeTypes = Array.from(activeButtons);

    // Filter data based on selected source and/or target
    const filteredData = data.filter(d =>
        (d.source === selectedSource || selectedSource === 'all') &&
        (d.target === selectedTarget || selectedTarget === 'all')
    );

    const activeSources = Array.from(new Set(filteredData.map(d => d.source)));
    let activeTargets = Array.from(new Set(filteredData.map(d => d.target)));
    activeTargets = cleanSet(activeTargets, activeSources);

    // Update links based on active sources, targets, and types
    const activeLinks = filteredData.filter(d =>
        activeSources.includes(d.source) &&
        activeTargets.includes(d.target) &&
        activeTypes.includes(d.type)
    );

    // Get unique nodes from active links
    const activeNodes = Array.from(new Set(activeLinks.flatMap(link => [link.source, link.target])));

    // Update node visibility
    svg.selectAll('circle')
        .style('visibility', d => 
            activeNodes.includes(d.id) ? 'visible' : 'hidden'
        );

    // Update link visibility
    svg.selectAll('line.link')
        .style('visibility', d => 
            activeLinks.some(link => link.source === d.source.id && link.target === d.target.id) ? 'visible' : 'hidden'
        );

    // Update label visibility
    svg.selectAll('text')
        .style('visibility', d => 
            activeNodes.includes(d.id) ? 'visible' : 'hidden'
        );
}

export { refreshGraph };
