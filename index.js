import {
  select,
  csv,
  scaleLog,
  extent,
  axisLeft,
  axisBottom,
  format
} from 'd3';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
  const title = 'Pokemon: Height vs. Weight';
  
  const xValue = d => d.height;
  const xAxisLabel = 'Height';
  
  const yValue = d => d.weight;
  const circleRadius = 8;
  const yAxisLabel = 'Weight';
  
  const margin = { top: 60, right: 40, bottom: 88, left: 150 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLog()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();
  
  const yScale = scaleLog()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);
  
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);
  
  const yAxisG = g.append('g').call(yAxis);
  yAxisG.selectAll('.domain').remove();
  
  yAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', -93)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text(yAxisLabel);
  
  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);
  
  xAxisG.select('.domain').remove();
  
  xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', 75)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text(xAxisLabel);
  
  g.selectAll('circle').data(data)
    .enter().append('circle')
      .attr('cy', d => yScale(yValue(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', circleRadius);
  
  g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .text(title);
};

csv('https://vizhub.com/curran/datasets/pokemon.csv')
  .then(data => {
    console.log(data.columns);
  	data.forEach(d => {
      d.height = +d.height;
      d.weight = +d.weight; 
    });
    render(data);
  });