import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Node } from 'src/app/node.model';
import { Edge } from 'src/app/edge.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];

  constructor() { }

/*  private rawGraph = {
    nodes: [],
    edges: []
    // [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]]
  };
*/
  private simulation = d3.forceSimulation();

  ngOnInit() {
    // const nodeCount = 16;
    // this.rawGraph.nodes = Array.from(Array(nodeCount).keys());
    // this.rawGraph.edges = generateEdges(nodeCount);
    const nodes = this.nodes.map(node => ({ id: node.id }));
    const edges = this.edges.map(edge => ({ source: nodes[edge.source], target: nodes[edge.target] }))
    this.simulation.nodes(nodes)
      .force('charge', d3.forceManyBody())
      .force('link', d3.forceLink(edges))
      .force('center', d3.forceCenter(100, 100));

    const svg = document.querySelector('svg');
    d3.select(svg)
      .call(d3.drag()
        .container(svg).subject(this.dragsubject)
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended));

  }

  dragsubject = () => {
    return this.simulation.find(d3.event.x, d3.event.y);
  }

  dragstarted = () => {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }

  dragged = () => {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  dragended = () => {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }


  get graph() {
    const nodes = this.simulation.nodes();
    const edges = this.edges.map(edge => ([nodes[edge.source], nodes[edge.target]]))
    return { nodes, edges }
  }

  onCircleClick(i) {
    console.log(this.graph.nodes[i]);
  }

  stringify = JSON.stringify

}
