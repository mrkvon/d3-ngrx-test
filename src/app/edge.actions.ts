import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Edge } from './edge.model';

export enum EdgeActionTypes {
  LoadEdges = '[Edge] Load Edges',
  AddEdge = '[Edge] Add Edge',
  UpsertEdge = '[Edge] Upsert Edge',
  AddEdges = '[Edge] Add Edges',
  UpsertEdges = '[Edge] Upsert Edges',
  UpdateEdge = '[Edge] Update Edge',
  UpdateEdges = '[Edge] Update Edges',
  DeleteEdge = '[Edge] Delete Edge',
  DeleteEdges = '[Edge] Delete Edges',
  ClearEdges = '[Edge] Clear Edges'
}

export class LoadEdges implements Action {
  readonly type = EdgeActionTypes.LoadEdges;

  constructor(public payload: { edges: Edge[] }) {}
}

export class AddEdge implements Action {
  readonly type = EdgeActionTypes.AddEdge;

  constructor(public payload: { edge: Edge }) {}
}

export class UpsertEdge implements Action {
  readonly type = EdgeActionTypes.UpsertEdge;

  constructor(public payload: { edge: Edge }) {}
}

export class AddEdges implements Action {
  readonly type = EdgeActionTypes.AddEdges;

  constructor(public payload: { edges: Edge[] }) {}
}

export class UpsertEdges implements Action {
  readonly type = EdgeActionTypes.UpsertEdges;

  constructor(public payload: { edges: Edge[] }) {}
}

export class UpdateEdge implements Action {
  readonly type = EdgeActionTypes.UpdateEdge;

  constructor(public payload: { edge: Update<Edge> }) {}
}

export class UpdateEdges implements Action {
  readonly type = EdgeActionTypes.UpdateEdges;

  constructor(public payload: { edges: Update<Edge>[] }) {}
}

export class DeleteEdge implements Action {
  readonly type = EdgeActionTypes.DeleteEdge;

  constructor(public payload: { id: string }) {}
}

export class DeleteEdges implements Action {
  readonly type = EdgeActionTypes.DeleteEdges;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearEdges implements Action {
  readonly type = EdgeActionTypes.ClearEdges;
}

export type EdgeActions =
 LoadEdges
 | AddEdge
 | UpsertEdge
 | AddEdges
 | UpsertEdges
 | UpdateEdge
 | UpdateEdges
 | DeleteEdge
 | DeleteEdges
 | ClearEdges;
