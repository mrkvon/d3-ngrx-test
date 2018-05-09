import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Edge } from './edge.model';
import { EdgeActions, EdgeActionTypes } from './edge.actions';

export interface State extends EntityState<Edge> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Edge> = createEntityAdapter<Edge>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: EdgeActions
): State {
  switch (action.type) {
    case EdgeActionTypes.AddEdge: {
      return adapter.addOne(action.payload.edge, state);
    }

    case EdgeActionTypes.UpsertEdge: {
      return adapter.upsertOne(action.payload.edge, state);
    }

    case EdgeActionTypes.AddEdges: {
      return adapter.addMany(action.payload.edges, state);
    }

    case EdgeActionTypes.UpsertEdges: {
      return adapter.upsertMany(action.payload.edges, state);
    }

    case EdgeActionTypes.UpdateEdge: {
      return adapter.updateOne(action.payload.edge, state);
    }

    case EdgeActionTypes.UpdateEdges: {
      return adapter.updateMany(action.payload.edges, state);
    }

    case EdgeActionTypes.DeleteEdge: {
      return adapter.removeOne(action.payload.id, state);
    }

    case EdgeActionTypes.DeleteEdges: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case EdgeActionTypes.LoadEdges: {
      return adapter.addAll(action.payload.edges, state);
    }

    case EdgeActionTypes.ClearEdges: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
