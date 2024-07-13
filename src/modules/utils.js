
function getUniqueItems(data, key) {
    return Array.from(new Set(data.map(d => d[key])));
}

function findNumberOfTargets(data) {
    const sourceTargetCounts = {}
    
    // Calculate the number of targets each source has
    data.forEach(d => {
        if (!sourceTargetCounts[d.source]) {
            sourceTargetCounts[d.source] = 0;
        }
        sourceTargetCounts[d.source]++;
    });

    return sourceTargetCounts;
}

export { getUniqueItems, findNumberOfTargets }