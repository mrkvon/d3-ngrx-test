import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private rawGraph = {
    nodes: [],
    edges: []
    // [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]]
  };

  private simulation = d3.forceSimulation();

  ngOnInit() {
    const nodeCount = 16;
    this.rawGraph.nodes = Array.from(Array(nodeCount).keys());
    this.rawGraph.edges = generateEdges(nodeCount);
    const nodes = this.rawGraph.nodes.map(node => ({}));
    const edges = this.rawGraph.edges.map(edge => ({ source: nodes[edge[0]], target: nodes[edge[1]] }))
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
    const edges = this.rawGraph.edges.map(edge => ([nodes[edge[0]], nodes[edge[1]]]))
    return { nodes, edges }
  }

  onCircleClick(i) {
    console.log(this.graph.nodes[i]);
  }

}

function generateEdges(n) {
  const nodes = Array.from(Array(n).keys());
  const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
  const edges = f(nodes, nodes).filter(edge => bitCount(edge[0] ^ edge[1]) === 1)
  console.log(edges)
  return edges;
}

function bitCount(u) {
  // https://blogs.msdn.microsoft.com/jeuge/2005/06/08/bit-fiddling-3/
  const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111);
  return ((uCount + (uCount >> 3)) & 0o30707070707) % 63;
}
