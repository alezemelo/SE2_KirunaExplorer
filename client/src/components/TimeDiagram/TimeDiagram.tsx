import dayjs from 'dayjs';
import React, { useRef, useEffect, useState } from 'react';
import { User } from "../../type";
import { Document } from "../../models/document";
import {  DocumentType as DocumentLocal } from "../../type";

import * as d3 from 'd3';
import { NumberValue } from 'd3';
import DocGraph from './DocGraph';

interface ScatterplotProps {
  documents: Document[];
  onLink: (document: Document) => void;
  fetchDocuments: () => Promise<void>;
  pin: number;
  setNewPin: any;
  updating: boolean,
  setUpdating: any;
  loggedIn: boolean;
  user: User | undefined;
  handleSearchLinking: () => Promise<void>;
  newDocument: DocumentLocal;
  setNewDocument: React.Dispatch<React.SetStateAction<DocumentLocal>>;
}

const Scatterplot: React.FC<ScatterplotProps> = (props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const [popUp, setPopUp] = useState<Document | undefined>(undefined);

  const types = Array.from(new Set(props.documents.map(d => d.type || 'Unknown')));
  
  const colorScale = d3.scaleOrdinal<string>()
      .domain(types)
      .range(d3.schemeCategory10); // Or any other color palette

  const onDocumentClick = (document: Document) => {
    setPopUp(document);
    alert(`Document Clicked: ${document.title}`);
  };

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const margin = { top: 20, right: 50, bottom: 50, left: 100 };
      const width = svg.node()!.getBoundingClientRect().width - margin.left - margin.right;
      const height = svg.node()!.getBoundingClientRect().height - margin.top - margin.bottom;
      

      // Clear the previous SVG contents
      svg.selectAll('*').remove();

      // Extract unique scales
      const scales = Array.from(
        new Set(props.documents.map(d => d.scale || 'Undefined'))
      );

      // Define X-Scale (time-based)
      const xScale = d3.scaleTime()
        .domain(d3.extent(props.documents, d => dayjs(d.issuanceDate).toDate()) as [Date, Date])
        .range([50, width - 50]);

      // Define Y-Scale (categorical)
      const yScale = d3.scaleBand()
      .domain(scales)
      .range([margin.top, height])
      .padding(0.2);
    

      // Add circles for each document
      svg.selectAll('circle')
        .data(props.documents)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(dayjs(d.issuanceDate).toDate()))
        .attr('cy', d => yScale(d.scale || 'Undefined')! + yScale.bandwidth() / 2)
        .attr('r', 8)
        .attr('fill', d => colorScale(d.type || 'Unknown'))        
        .attr('cursor', 'pointer')
        .on('click', (event, d) => onDocumentClick(d))
        .on('mouseover', (event, d) => {
          setTooltip({
            x: event.pageX,
            y: event.pageY,
            content: d.title,
          });
        })
        .on('mouseout', () => setTooltip(null));

      // Add X-axis
      svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat((domainValue: Date | NumberValue) => {
        const date = domainValue instanceof Date ? domainValue : new Date(domainValue.valueOf());
        return d3.timeFormat('%b %Y')(date);
      }));


      // Add Y-axis
      svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

      // Optional: Add a legend
    const legend = svg.append('g')
    .attr('transform', `translate(${width - 100},${margin.top})`);

      types.forEach((type, i) => {
        legend.append('circle')
          .attr('cx', 0)
          .attr('cy', i * 20)
          .attr('r', 6)
          .attr('fill', colorScale(type));
        
        legend.append('text')
          .attr('x', 15)
          .attr('y', i * 20 + 5)
          .text(type)
          .attr('font-size', '12px')
          .attr('alignment-baseline', 'middle')
          .attr('fill', 'white'); // Adjust for dark background
      });
    }

  }, [props.documents]);

  return (
    <div style={{ position: 'relative' }}>
      {popUp && 
      <DocGraph 
      document={props.documents}
      loggedIn={props.loggedIn}
      user={props.user}
      fetchDocuments={props.fetchDocuments}
      pin={props.pin}
      setNewPin={props.setNewPin}
      onLink={props.onLink}
      handleSearchLinking={props.handleSearchLinking}
      updating={props.updating}
      setUpdating={props.setUpdating} 
      newDocument={props.newDocument}
      setNewDocument={props.setNewDocument}
      />
      }
      <svg ref={svgRef} style={{ width: '100%', height: '500px', border: '1px solid black' }} />
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            background: 'white',
            color: 'black',
            border: '1px solid black',
            padding: '5px',
            pointerEvents: 'none',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default Scatterplot;
