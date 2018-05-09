import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Node } from './node.model';
import { NodeActions, NodeActionTypes } from './node.actions';

export interface State extends EntityState<Node> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Node> = createEntityAdapter<Node>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: NodeActions
): State {
  switch (action.type) {
    case NodeActionTypes.AddNode: {
      return adapter.addOne(action.payload.node, state);
    }

    case NodeActionTypes.UpsertNode: {
      return adapter.upsertOne(action.payload.node, state);
    }

    case NodeActionTypes.AddNodes: {
      return adapter.addMany(action.payload.nodes, state);
    }

    case NodeActionTypes.UpsertNodes: {
      return adapter.upsertMany(action.payload.nodes, state);
    }

    case NodeActionTypes.UpdateNode: {
      return adapter.updateOne(action.payload.node, state);
    }

    case NodeActionTypes.UpdateNodes: {
      return adapter.updateMany(action.payload.nodes, state);
    }

    case NodeActionTypes.DeleteNode: {
      return adapter.removeOne(action.payload.id, state);
    }

    case NodeActionTypes.DeleteNodes: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case NodeActionTypes.LoadNodes: {
      return adapter.addAll(action.payload.nodes, state);
    }

    case NodeActionTypes.ClearNodes: {
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
