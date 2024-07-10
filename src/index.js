import * as d3 from 'd3';
import embed from 'vega-embed';

// D3.js example
const d3Container = d3.select('#d3-container')
  .append('svg')
  .attr('width', 500)
  .attr('height', 500)
  .append('circle')
  .attr('cx', 250)
  .attr('cy', 250)
  .attr('r', 100)
  .style('fill', 'blue');

// Vega-Lite example
const vegaLiteSpec = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
  'description': 'A simple bar chart with embedded data.',
  'data': {
    'values': [
      {'a': 'A', 'b': 28}, {'a': 'B', 'b': 55}, {'a': 'C', 'b': 43},
      {'a': 'D', 'b': 91}, {'a': 'E', 'b': 81}, {'a': 'F', 'b': 53},
      {'a': 'G', 'b': 19}, {'a': 'H', 'b': 87}, {'a': 'I', 'b': 52}
    ]
  },
  'mark': 'bar',
  'encoding': {
    'x': {'field': 'a', 'type': 'nominal'},
    'y': {'field': 'b', 'type': 'quantitative'}
  }
};

embed('#vega-lite-container', vegaLiteSpec);
