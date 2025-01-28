import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const QualityLineChart = ({ data, w, h }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Set up the SVG element dimensions
    const width = w;
    const height = h;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Parse the data, ensuring quality is numeric
    const parsedData = data.map(d => ({
      date: d3.timeParse("%Y-%m-%d")(d.dateString),  // Convert dateString to Date object
      quality: +d.quality  // Convert quality to number
    })).filter(d => !isNaN(d.quality));  // Filter out any non-numeric qualities

    // Define scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date))  // X axis based on date range
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 10])  // Y axis based on quality (scale 1 to 10)
      .range([height - margin.bottom, margin.top]);

    // Clear previous SVG content before re-rendering
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create the line generator
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.quality))
      .curve(d3.curveMonotoneX);  // Smooth line

    // Append the path (line)
    svg.append('path')
      .datum(parsedData)
      .attr('fill', 'none')
      .attr('stroke', '#39FF14')  // Neon green color for the line
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d")));  // Format dates on x-axis

    // Add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    // Add axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text('Date');

    svg.append('text')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text('Dream Quality (1-10)');

  }, [data]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default QualityLineChart;
