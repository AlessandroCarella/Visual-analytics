
function getUniqueItems(data, key) {
    return Array.from(new Set(data.map(d => d[key])));
}

export { getUniqueItems }