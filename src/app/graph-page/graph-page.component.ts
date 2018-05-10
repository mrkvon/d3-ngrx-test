import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, fromEvent } from 'rxjs';
import { withLatestFrom, map, tap } from 'rxjs/operators';

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

  @ViewChild('addNodeButton') addNodeButton;
  @ViewChild('removeNodeButton') removeNodeButton;
  addNodeClicks$: Observable<void>;
  removeNodeClicks$: Observable<void>;

  nodes$: Observable<Node[]>;
  edges$: Observable<Edge[]>;
  selectedNodes$: Observable<Node[]>;

  constructor(private store: Store<fromRoot.State>) {
    // initialize graph
    const nodeCount = 8;
    this.store.dispatch(new nodeActions.AddNodes({ nodes: generateNodes(nodeCount) }));
    this.store.dispatch(new edgeActions.AddEdges({ edges: generateEdges(nodeCount) }));

    this.nodes$ = this.store.pipe(select(fromRoot.getAllNodes));
    this.edges$ = this.store.pipe(select(fromRoot.getAllEdges));
    this.selectedNodes$ = this.store.pipe(select(fromRoot.getSelectedNodes));
  }

  ngOnInit() {
    this.addNodeClicks$ = fromEvent(this.addNodeButton.nativeElement, 'click')
      .pipe(
        withLatestFrom(this.nodes$),
        map(([_a, nodes]) => nodes)
      )
      .subscribe((nodes) => {
        const nodeCount = nodes.length;
        this.store.dispatch(new nodeActions.AddNode({ node: { id: String(nodes.length) } }))
        this.store.dispatch(new edgeActions.AddEdges({ edges: generateEdges(nodeCount + 1) }));
      })

    this.removeNodeClicks$ = fromEvent(this.removeNodeButton.nativeElement, 'click')
      .pipe(
        withLatestFrom(this.nodes$),
        map(([_a, nodes]) => nodes)
      )
      .subscribe((nodes) => {
        this.store.dispatch(new nodeActions.DeleteNode({ id: String(nodes.length - 1) }))
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
  const edges = f(nodes, nodes).filter(edge => bitCount(edge[0] ^ edge[1]) === 1)
  return edges.map((edge, index) => ({ id: String(index), source: String(edge[0]), target: String(edge[1]) }))
}

function bitCount(u) {
  // https://blogs.msdn.microsoft.com/jeuge/2005/06/08/bit-fiddling-3/
  const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111);
  return ((uCount + (uCount >> 3)) & 0o30707070707) % 63;
}
