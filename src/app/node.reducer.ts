import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { Node } from './node.model';
import { NodeActions, NodeActionTypes } from './node.actions';

export interface State extends EntityState<Node> {
  // additional entities state properties
  selectedIds: string[];
}

export const adapter: EntityAdapter<Node> = createEntityAdapter<Node>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedIds: []
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
      const updatedState = (state.selectedIds.includes(action.payload.id))
        ? { ...state, selectedIds: state.selectedIds.filter(id => id !== action.payload.id) }
        : state;
      return adapter.removeOne(action.payload.id, updatedState);
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

    case NodeActionTypes.ToggleNodeSelection: {
      // add or remove a node with given id to selected node ids
      if ((state.ids as string[]).includes(action.payload.id)) {
        if (state.selectedIds.includes(action.payload.id)) {
          // add
          return {
            ...state,
            selectedIds: state.selectedIds.filter(id => id !== action.payload.id)
          };
        } else {
          // remove
          return {
            ...state,
            selectedIds: [...state.selectedIds, action.payload.id]
          };
        }
      }
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

export const getSelectedIds = (state: State) => state.selectedIds;

/**
 * get selected nodes
 */
export const getSelected = createSelector(
  getSelectedIds,
  selectEntities,
  (ids, entities) => {
    return ids.map(id => entities[id])
  }
);
