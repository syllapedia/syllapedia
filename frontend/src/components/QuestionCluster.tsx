import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

interface Link {
  source: string;
  target: string;
  type: string;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  name?: string;
  frequency?: number;
  success_rate?: number;
  text?: string;
}

interface Data {
  links: Link[];
  nodes: Node[];
}

interface ForceDirectedGraphProps {
  data: Data;
}

const QuestionCluster: React.FC<ForceDirectedGraphProps> = ({ data }) => {
    const theme = useTheme();

    const svgRef = useRef<SVGSVGElement>(null);

    const [links, setLinks] = useState(data.links.map(d => ({ ...d })));
    const [nodes, setNodes] = useState(data.nodes.map(d => ({ ...d })));
    const [qFrequencyMax, setQFrequencyMax] = useState(data.nodes.reduce((acc, e) => e.frequency && e.frequency > acc ? e.frequency : acc, 1));

    useEffect(() => {
        const colors = {
            Instructor: "#712F79",
            Course: "#4381C1",
          };
          
        const color = d3.scaleOrdinal()
            .domain(["Instructor", "Course"])
            .range([colors.Instructor, colors.Course]);

        const successRateColor = d3.scaleLinear<string>()
            .domain([0, 1])
            .range(["#B91C1C", "#285943"]);

        const container = svgRef.current?.parentNode as HTMLElement;
        const width = container ? container.offsetWidth : 1000;
        const height = container ? container.offsetHeight : 1000;

        const simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-20))
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance((d: any) => d.type === "Instructs" ? 100 : 30))
            .force("collide", d3.forceCollide().radius((d: any) => d.type === "Instructs" ? 40 : 20))
            .force("center", d3.forceCenter(width / 2, height / 2).strength(0.3))
            .velocityDecay(0.7)
            .alphaDecay(0.02)
            .restart()
            .on("tick", ticked);

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("style", "max-width: 100%; height: auto; display: block;");

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
                .attr("stroke-width", 1);

        const node = svg.append("g")
            .attr("stroke", theme.palette.text.primary)
            .attr("stroke-width", 1)
            .selectAll<SVGGElement, Node>("g")
            .data(nodes)
            .join("g");
        
        node.append<SVGCircleElement>("circle")
            .attr("r", (d: Node) =>
                d.label
                ? d.label === "Instructor"
                    ? 24
                    : d.label === "Course"
                    ? 18
                    : d.frequency
                        ? 4 + (8 * d.frequency / qFrequencyMax)
                        : 4
                : 4)
            .attr("fill", (d: Node) =>
                d.label === "Question" && d.success_rate !== undefined
                  ? successRateColor(d.success_rate)
                  : color(d.label) as string
            );            
        node.append("title")
            .text((d: Node) => d.name ? d.name : d.text ? d.text : d.id);
        
        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", theme.palette.text.primary)
            .attr("stroke-width", 0)
            .style("font-size", "10px")
            .text((d: Node) => d.name ?? "");
        
        node.call(d3.drag<SVGGElement, Node>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        function ticked() {
            link
                .transition()
                .duration(20)
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);
            
            node
                .transition()
                .duration(20)
                .attr("transform", (d: any) => {
                    let r = d.label === "Instructor" ? 24 : 18;
                    d.x = Math.max(r, Math.min(width - r, d.x));
                    d.y = Math.max(r, Math.min(height - r, d.y));
                    return `translate(${d.x}, ${d.y})`;
                });
            }

        function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, any>) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, any>) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, any>) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, [data, theme]);

    return <><Typography variant="h6" color={theme.palette.text.primary} sx={{margin: "20px 0px"}}>Question Cluster</Typography><svg ref={svgRef}/></>;
};

export default QuestionCluster;