import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, w, h }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Set up the SVG element dimensions
    const width = w;
    const height = h;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Parse and filter the data to ensure dreamLength is numeric
    const parsedData = data.map(d => ({
      date: d3.timeParse("%Y-%m-%d")(d.dateString),  // Parse date strings into Date objects
      dreamLength: +d.dreamLength // Convert dreamLength to number
    })).filter(d => !isNaN(d.dreamLength));  // Filter out any non-numeric dream lengths

    // Define scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date))  // X axis based on date range
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.dreamLength)])  // Y axis based on dream length
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
      .y(d => yScale(d.dreamLength))
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
      .text('Dream Length (hours)');

  }, [data]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default LineChart;
