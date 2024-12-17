import dayjs from 'dayjs';

import { useLocation } from 'react-router-dom';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { User } from '../../type';
import { Document } from '../../models/document';
import { DocumentType as DocumentLocal } from '../../type';
import DocDetailsGraph from './DocDetailsGraph';

interface TimeDiagramProps {
  documents: Document[];
  onLink: (document: Document) => void;
  fetchDocuments: () => Promise<void>;
  pin: number;
  setNewPin: any;
  updating: boolean;
  setUpdating: any;
  loggedIn: boolean;
  user: User | undefined;
  handleSearchLinking: () => Promise<void>;
  newDocument: DocumentLocal;
  setNewDocument: React.Dispatch<React.SetStateAction<DocumentLocal>>;
}

const TimeDiagram: React.FC<TimeDiagramProps> = (props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const [popUp, setPopUp] = useState<Document | undefined>(undefined);
  const [highlighted, setHighlighted] = useState<number | undefined>(undefined);
  const location = useLocation();


  const types = Array.from(new Set(props.documents.map(d => d.type || 'Unknown')));
  const colorScale = d3.scaleOrdinal<string>().domain(types).range(d3.schemeCategory10);

  const onDocumentClick = (document: Document) => {
    setPopUp(document);
  };

  const handleNavigation = (id: number) => {
    const targetDocument = props.documents.find(doc => doc.id === id);
    setPopUp(targetDocument);
  };

  const redrawChart = useCallback(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const margin = { top: 20, right: 0, bottom: 50, left: 150 };
      const width = svg.node()!.getBoundingClientRect().width - margin.left - margin.right;
      const height = svg.node()!.getBoundingClientRect().height - margin.top - margin.bottom;
  
      // Clear the previous SVG contents
      svg.selectAll('*').remove();
  
      // Add zoomable group
      const zoomGroup = svg.append('g').attr('class', 'zoom-group');
  
      // Validate dates and filter invalid ones
      const validDates = props.documents
        .map(d => dayjs(d.issuanceDate).toDate())
        .filter(date => !isNaN(date.getTime()));
  
      if (validDates.length === 0) {
        console.error("No valid dates found in documents.");
        return;
      }
  
      const timeDomain = d3.extent(validDates) as [Date, Date];
  
      // Add padding to the time domain
      let [minDate, maxDate] = timeDomain;
      if (minDate.getTime() === maxDate.getTime()) {
        minDate = d3.timeDay.offset(minDate, -1);
        maxDate = d3.timeDay.offset(maxDate, 1);
      }
  
      const paddedDomain: [Date, Date] = [
        d3.timeDay.offset(minDate, -1),
        d3.timeDay.offset(maxDate, 1),
      ];
  
      const xScale = d3.scaleTime()
        .domain(paddedDomain)
        .range([margin.left, width - margin.right]);
  
      const yScale = d3.scaleBand()
        .domain(Array.from(new Set(props.documents.map(d => d.scale || 'Undefined'))))
        .range([margin.top, height - margin.bottom])
        .paddingInner(0.2)
        .padding(0.6);
  
      const initialXScale = xScale.copy();
      const initialYScale = yScale.copy();
  
      const xAxis: d3.Axis<Date | d3.NumberValue> = d3.axisBottom(xScale).tickFormat((domainValue: Date | d3.NumberValue) => {
        const date = domainValue instanceof Date ? domainValue : new Date(domainValue.valueOf());
        return d3.timeFormat('%b %Y')(date);
      });
  
      const yAxis: d3.Axis<string> = d3.axisLeft(yScale);
  
      const xAxisSelection = svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height - margin.bottom})`);
      xAxisSelection.call(xAxis)
        .selectAll('text') // Select x-axis labels
        .style('font-size', '16px'); // Increase font size for x-axis labels
  
      const yAxisSelection = svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin.left},0)`);
      yAxisSelection.call(yAxis)
        .selectAll('text') // Select y-axis labels
        .style('font-size', '16px'); // Increase font size for y-axis labels
  
      // Draw grid lines
      const gridGroup = svg.append('g').attr('class', 'grid-group');
      const drawGridLines = (xScale: d3.ScaleTime<number, number>, yScale: d3.ScaleBand<string>) => {
        gridGroup.selectAll('.x-grid-line').remove();
        gridGroup.selectAll('.y-grid-line').remove();
  
        // X Grid Lines
        const yearTicks = d3.timeYear.range(xScale.domain()[0], xScale.domain()[1]);
        gridGroup.selectAll('.x-grid-line')
          .data(yearTicks)
          .enter()
          .append('line')
          .attr('class', 'x-grid-line')
          .attr('x1', d => xScale(d))
          .attr('x2', d => xScale(d))
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom)
          .attr('stroke', '#ccc')
          .attr('stroke-dasharray', '2,2');
  
        // Y Grid Lines
        gridGroup.selectAll('.y-grid-line')
          .data(yScale.domain())
          .enter()
          .append('line')
          .attr('class', 'y-grid-line')
          .attr('x1', margin.left)
          .attr('x2', width - margin.right)
          .attr('y1', d => (yScale(d) ?? margin.top) + yScale.bandwidth() / 2)
          .attr('y2', d => (yScale(d) ?? margin.top) + yScale.bandwidth() / 2)
          .attr('stroke', '#ccc')
          .attr('stroke-dasharray', '2,2');
      };
  
      drawGridLines(xScale, yScale);
  
      const drawCircles = () => {
        zoomGroup.selectAll('circle')
          .data(props.documents)
          .join('circle')
          .attr('cx', d => xScale(dayjs(d.issuanceDate).toDate()))
          .attr('cy', d => (yScale(d.scale || 'Undefined') ?? margin.top) + yScale.bandwidth() / 2)
          .attr('r', d => d.id === highlighted ? 12 : 8) // Increase radius for highlighted circle
          .attr('fill', d => colorScale(d.type || 'Unknown'))
          .attr('class', d => d.id === highlighted ? 'highlighted-circle' : 'default-circle')
          .style('stroke', d => d.id === highlighted ? 'red' : 'none')
          .style('stroke-width', d => d.id === highlighted ? '3px' : '0px')
          .style('opacity', d => d.id === highlighted ? 1 : 0.7)
          .on('click', (_, d) => onDocumentClick(d))
          .on('mouseover', (event, d) => {
            setTooltip({ x: event.pageX, y: event.pageY, content: d.title });
          })
          .on('mouseout', () => setTooltip(null));
      };
  
      drawCircles();
  
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.9, 20])
        .on('zoom', (event) => {
          const transform = event.transform;
          const newXScale = transform.rescaleX(initialXScale);
          const newYScale = yScale.copy().range(yScale.range().map(d => transform.applyY(d)));
  
          zoomGroup.selectAll('circle')
            .attr('cx', (d: any) => newXScale(dayjs(d.issuanceDate).toDate()))
            .attr('cy', (d: any) => (newYScale(d.scale || 'Undefined') ?? margin.top) + newYScale.bandwidth() / 2);
  
          xAxisSelection.call(xAxis.scale(newXScale));
          yAxisSelection.call(yAxis.scale(newYScale));
          xAxisSelection.selectAll('text')
          .style('font-size', (event.transform.k > 2) ? '14px' : '16px');  // Smaller font when zoomed in
          drawGridLines(newXScale, newYScale);
        });
  
      svg.call(zoom);

      // Highlight and center the circle if highlightedId is set
      if (highlighted) {
        console.log('highlighted', highlighted);
        const targetDocument = props.documents.find(d => d.id === highlighted);
        if (targetDocument) {
          const targetX = xScale(dayjs(targetDocument.issuanceDate).toDate());
          console.log('targetX', dayjs(targetDocument.issuanceDate).toDate());
          const targetY = yScale(targetDocument.scale || 'Undefined') ?? 0;
          console.log('targetY', targetDocument.scale );

          // Center the view on the highlighted circle
          svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity.translate(width / 4 - targetX, height / 4 - targetY).scale(1.5)
          );
        }
      }
  
      // Add legend
      // Add legend
      const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 200},${margin.top})`); // Adjusted for more space

      const legendItemHeight = 30; // Increased spacing between items
      const legendCircleRadius = 10; // Larger circles

      legend.append('rect')
      .attr('width', 160) // Wider rectangle
      .attr('height', types.length * legendItemHeight + 10) // Adjust height for new spacing
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('rx', 5)
      .attr('ry', 5);

      types.forEach((type, i) => {
      legend.append('circle')
        .attr('cx', 15) // Adjusted for larger radius
        .attr('cy', i * legendItemHeight + 15) // Adjusted for larger spacing
        .attr('r', legendCircleRadius)
        .attr('fill', colorScale(type));

      legend.append('text')
        .attr('x', 40) // Adjusted for larger circle
        .attr('y', i * legendItemHeight + 19) // Adjusted for spacing
        .text(type)
        .attr('font-size', '16px') // Increased font size
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'black');
      });

        // Add button under legend
      if (highlighted !== undefined) {
        legend.append('foreignObject')
        .attr('x', 10)
        .attr('y', types.length * legendItemHeight + 20) // Position button below the legend
        .attr('width', 140)
        .attr('height', 40)
        .append('xhtml:div')
        .html(`
          <button style="
            width: 100%;
            padding: 5px;
            font-size: 14px;
            background-color: red;
            color: white;
            border: 1px solid black;
            border-radius: 5px;
            cursor: pointer;
          ">Clear Highlight</button>
        `)
        .on('click', () => setHighlighted(undefined));
      }
    }
  }, [props.documents,  highlighted]);
  
  
  useEffect(() => {
    redrawChart();

    const handleResize = () => {
      redrawChart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [redrawChart]);

  useEffect(() => {
    if (location.state?.popup) {
      setPopUp(location.state.popup); // Update popup state from navigation
    }
  }, [location.state]);

  // Set the highlighted document from navigation state
  useEffect(() => {
    if (location.state?.highlighted) {
      setHighlighted(location.state.highlighted);
    }
  }, [location.state]);


  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {popUp && 
        <DocDetailsGraph 
          document={popUp}
          handleNavigation={handleNavigation}
          setPopup={setPopUp}
        />
      }
        {/* SVG container */}
        <svg ref={svgRef} style={{ width: '100%', height: '100vh', border: '1px solid black' }} />
        
       
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

export default TimeDiagram;
