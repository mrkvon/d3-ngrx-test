import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, fromEvent } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';

import * as nodeActions from 'src/app/node.actions';
import * as edgeActions from 'src/app/edge.actions';

import { Node } from 'src/app/node.model';
import { Edge } from 'src/app/edge.model';

import * as fromRoot from 'src/app/reducers';

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.css']
})
export class GraphPageComponent implements OnInit {

  // buttons for adding and removing nodes
  @ViewChild('addNodeButton') addNodeButton;
  @ViewChild('removeNodeButton') removeNodeButton;

  nodes$: Observable<Node[]>;
  edges$: Observable<Edge[]>;
  selectedNodes$: Observable<Node[]>;

  constructor(private store: Store<fromRoot.State>) {
    // initialize graph
    //
    // number of vertices
    const nodeCount = 8;
    // Generate nodes and edges with utility functions (below)
    // The graph is a hypercube
    this.store.dispatch(new nodeActions.AddNodes({ nodes: generateNodes(nodeCount) }));
    this.store.dispatch(new edgeActions.AddEdges({ edges: generateEdges(nodeCount) }));

    this.nodes$ = this.store.pipe(select(fromRoot.getAllNodes));
    this.edges$ = this.store.pipe(select(fromRoot.getAllEdges));
    this.selectedNodes$ = this.store.pipe(select(fromRoot.getSelectedNodes));
  }

  ngOnInit() {

    // create observable for processing add node button click
    // and subscribe and in subscription dispatch action to create additional nodes and edges
    fromEvent(this.addNodeButton.nativeElement, 'click')
      .pipe(
        withLatestFrom(this.nodes$),
        map(([_a, nodes]) => nodes)
      )
      .subscribe((nodes) => {
        const nodeCount = nodes.length;
        const edgesBefore = generateEdges(nodeCount);
        const edgesAfter = generateEdges(nodeCount + 1);
        const additionalEdges = edgesAfter.filter(edge => !edgesBefore.map(e => e.id).includes(edge.id))

        this.store.dispatch(new edgeActions.AddEdges({ edges: additionalEdges }));
        this.store.dispatch(new nodeActions.AddNode({ node: { id: String(nodes.length) } }))
      })

    // create observable for processing remove node button click
    // and subscribe and in subscription dispatch action to remove nodes and edges we want to remove
    fromEvent(this.removeNodeButton.nativeElement, 'click')
      .pipe(
        withLatestFrom(this.nodes$),
        map(([_a, nodes]) => nodes)
      )
      .subscribe((nodes) => {
        const nodeCount = nodes.length;
        const edgesBefore = generateEdges(nodeCount);
        const edgesAfter = generateEdges(nodeCount - 1);
        const edgeIdsToRemove = edgesBefore.filter(edge => !edgesAfter.map(e => e.id).includes(edge.id))
          .map(edge => edge.id)

        this.store.dispatch(new edgeActions.DeleteEdges({ ids: edgeIdsToRemove }));
        this.store.dispatch(new nodeActions.DeleteNode({ id: String(nodeCount - 1) }))
      })
  }

  onToggleSelection(id) {
    this.store.dispatch(new nodeActions.ToggleNodeSelection({ id }));
  }

}


// some helper functions for generating the graph
function generateNodes(n): Node[] {
  return Array.from(Array(n).keys()).map(id => ({ id: String(id) }))
}

function generateEdges(n): Edge[] {
  const nodes = Array.from(Array(n).keys());
  const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
  const edges = f(nodes, nodes)
    .filter(edge => edge[0] < edge[1] && bitCount(edge[0] ^ edge[1]) === 1)
    .sort((a, b) => (a[1] > b[1]) ? 1 : (a[1] === b[1] && a[0] > b[0]) ? 1 : -1)
  return edges.map((edge, index) => ({ id: String(index), source: String(edge[0]), target: String(edge[1]) }))
}

function bitCount(u) {
  // https://blogs.msdn.microsoft.com/jeuge/2005/06/08/bit-fiddling-3/
  const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111);
  return ((uCount + (uCount >> 3)) & 0o30707070707) % 63;
}
