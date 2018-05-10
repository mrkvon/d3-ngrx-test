import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import { Node } from 'src/app/node.model';
import { Edge } from 'src/app/edge.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  @Output() select: EventEmitter<string> = new EventEmitter<string>();
  @Input() nodes: Node[] = [];
  @Input() selectedNodes: Node[] = [];
  @Input() edges: Edge[] = [];

  constructor() { }

  private simulation = d3.forceSimulation();

  ngOnInit() {
    const nodes = this.nodes.map(node => ({ id: node.id }));
    const edges = this.edges.map(edge => ({ source: nodes[edge.source], target: nodes[edge.target] }))
    this.simulation.nodes(nodes)
      .alphaTarget(1)
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
    if (!d3.event.active) this.simulation.alphaTarget(1).restart();
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
    const selectedNodes = nodes.filter(node => this.selectedNodes.map(selectedNode => selectedNode.id).includes(node['id']))

    const edges = this.edges.map(edge => ([nodes[edge.source], nodes[edge.target]]))
    return { nodes, edges, selectedNodes }
  }

  onCircleClick(i) {
    this.select.emit(i);
  }

  // stringify = JSON.stringify

}
