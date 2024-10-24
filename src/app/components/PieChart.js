import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data, w, h }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Set up the SVG element dimensions
    const width = w;
    const height = h;
    const radius = Math.min(width, height) / 2;

    // Prepare the data (if not already prepared)
    const pieData = Object.entries(data).map(([key, value]) => ({
      label: key,
      value: value
    }));

    // Clear previous SVG content before re-rendering (important for re-renders)
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal()
      .domain(pieData.map(d => d.label))
      .range(['#32CD32', '#ADFF2F', '#7FFF00', '#76FF03', '#BFFF00']);

    const pie = d3.pie()
      .value(d => d.value);

    const data_ready = pie(pieData);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    svg
      .selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .style("opacity", 0.7);

    // Add labels
    svg
      .selectAll('labels')
      .data(data_ready)
      .enter()
      .append('text')
      .text(d => d.data.label)
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 12);

  }, [data]); // Re-render chart when `data` changes

  return (
    <svg ref={svgRef}></svg>
  );
};

export default PieChart;
