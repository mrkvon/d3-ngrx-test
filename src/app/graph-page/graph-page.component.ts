import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as nodeActions from 'src/app/node.actions';
import * as edgeActions from 'src/app/edge.actions';

import { Node } from 'src/app/node.model';
import { Edge } from 'src/app/edge.model';

import * as fromStore from 'src/app/reducers';

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.css']
})
export class GraphPageComponent implements OnInit {

  nodes: Observable<Node[]>;
  edges: Observable<Edge[]>;

  constructor(private store: Store<fromStore.State>) {
    // initialize graph
    const nodeCount = 16
    this.store.dispatch(new nodeActions.AddNodes({ nodes: generateNodes(nodeCount) }));
    this.store.dispatch(new edgeActions.AddEdges({ edges: generateEdges(nodeCount) }));

    this.nodes = this.store.pipe(select((state: any) => state.node.ids.map(id => state.node.entities[id])));
    this.edges = this.store.pipe(select((state: any) => state.edge.ids.map(id => state.edge.entities[id])));
  }

  ngOnInit() {
  }

}


// some helper functions for generating the graph
function generateNodes(n): Node[] {
  return Array.from(Array(n).keys()).map(id => ({ id: String(id) }))
}

function generateEdges(n): Edge[] {
  const nodes = Array.from(Array(n).keys());
  const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
  const edges = f(nodes, nodes).filter(edge => bitCount(edge[0] ^ edge[1]) === 1)
  return edges.map((edge, index) => ({ id: String(index), source: String(edge[0]), target: String(edge[1]) }))
}

function bitCount(u) {
  // https://blogs.msdn.microsoft.com/jeuge/2005/06/08/bit-fiddling-3/
  const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111);
  return ((uCount + (uCount >> 3)) & 0o30707070707) % 63;
}
