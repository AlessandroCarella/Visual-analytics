// Import D3
import * as d3 from 'd3';

// Path to your JSON file
const jsonFilePath = 'src/data/edgesClean.json';

// Load JSON file
d3.json(jsonFilePath).then(function(data) {
    // Assuming data is an array, slice it to get the first 3 entries
    const firstThreeEntries = data.slice(0, 3);
    
    // Log or do something with the first 3 entries
    console.log(firstThreeEntries);
    
    // Example: Display the first 3 entries in a list
    const list = d3.select('body').append('ul');
    
    list.selectAll('li')
        .data(firstThreeEntries)
        .enter()
        .append('li')
        .text(d => JSON.stringify(d)); // Display each entry as JSON string
}).catch(function(error) {
    console.error('Error loading JSON file:', error);
});
