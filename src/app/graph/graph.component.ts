import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Node } from 'src/app/node.model';
import { Edge } from 'src/app/edge.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnChanges, OnInit {

  // event for toggling a selection of a node
  @Output() select: EventEmitter<string> = new EventEmitter<string>();
  @Input() nodes: Node[] = [];
  @Input() selectedNodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @ViewChild('graphContainer') graphContainer;

  constructor() { }

  private simulation = d3.forceSimulation();

  ngOnInit() {

    // enable dragging
    d3.select(this.graphContainer.nativeElement)
      .call(d3.drag()
        .container(this.graphContainer.nativeElement).subject(this.dragsubject)
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended));

    // enable selecting
    d3.select(this.graphContainer.nativeElement)
      .on('click', this.selectNode)
  }

  private selectNode = () => {
    const point = d3.mouse(this.graphContainer.nativeElement);
    const node = this.simulation.find(point[0], point[1], 20) as Node;

    if (node) this.select.emit(node.id);
  }

  private dragsubject = () => {
    return this.simulation.find(d3.event.x, d3.event.y);
  }

  private dragstarted = () => {
    if (!d3.event.active) this.simulation.alphaTarget(1).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }

  private dragged = () => {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  private dragended = () => {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }

  ngOnChanges(changes: SimpleChanges) {

    // run this only when nodes changed
    if (!changes.nodes) return;

    const nodes = this.simulation.nodes();

    const nodesToAdd = setMinusSet(this.nodes, nodes).map(node => ({ ...node }));
    const nodesToRemove = setMinusSet(nodes, this.nodes);

    const updatedNodes = setMinusSet(nodes, nodesToRemove).concat(nodesToAdd);

    const edges = this.edges.map(edge => ({ source: updatedNodes[edge.source], target: updatedNodes[edge.target] }))

    this.simulation.nodes(updatedNodes)
      .force('charge', d3.forceManyBody())
      .force('link', d3.forceLink(edges))
      .force('center', d3.forceCenter(200, 200))
      .alphaTarget(1)
      .on('tick', this.drawGraph.bind(this))
      .restart()
  }

  private drawGraph() {
    const graph = this.getGraph();
    const context = this.graphContainer.nativeElement.getContext('2d');

    const width = 400;
    const height = 400;
    context.clearRect(0, 0, width, height);
    context.save();

    context.beginPath();
    graph.edges.forEach(drawLink);
    context.lineWidth = 2;
    context.strokeStyle = "lightgray";
    context.stroke();

    context.beginPath();
    graph.nodes.filter(node => !graph.selectedNodes.includes(node)).forEach(drawNode);
    context.fillStyle = '#88f';
    context.fill();

    context.beginPath();
    graph.selectedNodes.forEach(drawNode);
    context.fillStyle = '#f88';
    context.fill();

    context.fillStyle = 'black';
    context.font = '16px sans-serif';
    context.textBaseline = 'middle';
    graph.selectedNodes.forEach(writeText);

    context.restore();

    function drawLink(d) {
      context.moveTo(d[0].x, d[0].y);
      context.lineTo(d[1].x, d[1].y);
    }

    function drawNode(d) {
      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, 10, 0, 2 * Math.PI);
    }

    function writeText(d) {
      context.fillText(d.id, d.x + 10, d.y);
    }
  }


  private getGraph() {
    const nodes = this.simulation.nodes();
    const selectedNodes = nodes.filter(node => this.selectedNodes.map(selectedNode => selectedNode.id).includes(node['id']))

    const edges = this.edges.map(edge => ([nodes[edge.source], nodes[edge.target]]))
    return { nodes, edges, selectedNodes }
  }

  // stringify = JSON.stringify

}

function setMinusSet(a: any[], b: any[]): any[] {
  return a.filter(ael => !b.map(bel => bel.id).includes(ael.id))
}
