import dayjs from 'dayjs';
import React, { useRef, useEffect, useState } from 'react';
import { Document } from "../../models/document";
import * as d3 from 'd3';

interface ScatterplotProps {
  documents: Document[];
  onDocumentClick: (docId: number) => void; // Callback function when a document is clicked
}

const Scatterplot: React.FC<ScatterplotProps> = (props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  // Define the function to handle document click event inside the component
  const onDocumentClick = (document: any) => {
    // Here, you can set the selected document in the state
    //setSelectedDocument(document);
    // Optionally, do something with the selected document (e.g., open a modal)
    alert(`Document Clicked: ${document.title}`);
  };

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = svg.node()!.getBoundingClientRect().width;
      const height = svg.node()!.getBoundingClientRect().height;

      // Clear the previous SVG contents before rendering the new scatterplot
      svg.selectAll('*').remove();

      // Create a Set to keep track of unique scales
      let scales: Set<string> = new Set();  // Set to keep track of unique values

      props.documents.forEach(item => {
        if (item.scale) {
          scales.add(item.scale);  // Add the item to the set
        }
      });

      scales.add('Undefined'); // Add an entry for undefined values

      // Create scales for positioning the points
      const xScale = d3.scaleTime()
        .domain([0, d3.max(props.documents, d => dayjs(d.issuanceDate)) || 1]) // Scale for X-axis
        .range([0, width]);

      // Create the Y-scale using d3.scaleBand for categorical data
      const yScale = d3.scaleBand(Array.from(scales), [0, height])
        //.domain(Array.from(scales))
        //.range([height, 0]);

      // Add circles for each document
      svg.selectAll('circle')
        .data(props.documents)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(dayjs(d.issuanceDate))) // Set X position based on issuanceDate
        .attr('cy', d => yScale(d.scale ? d.scale : 'Undefined')) // Set Y position based on scale
        .attr('r', 8)
        .attr('fill', 'steelblue')
        .attr('cursor', 'pointer')
        .on('click', (event, d) => {
          onDocumentClick(d.id); // Handle document click
        })
        .on('mouseover', (event, d) => {
          setTooltip(d.title); // Show title on hover
        })
        .on('mouseout', () => {
          setTooltip(null); // Hide title when mouse leaves
        });

      // Optional: Add axes to the scatterplot (X and Y)
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      svg.append('g')
        .call(d3.axisLeft(yScale));
    }
  }, [props.documents]);

  return (
    <div>
      <svg ref={svgRef} width="100%" height="500px" />
      {tooltip && <div style={{ position: 'absolute', background: 'white', padding: '5px', border: '1px solid black' }}>{tooltip}</div>}
    </div>
  );
};

export default Scatterplot;