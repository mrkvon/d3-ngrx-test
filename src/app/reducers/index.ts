import {
  // ActionReducer,
  ActionReducerMap,
  // createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromNode from '../node.reducer';
import * as fromEdge from '../edge.reducer';

export interface State {
  node: fromNode.State,
  edge: fromEdge.State
}

export const reducers: ActionReducerMap<State> = {
  node: fromNode.reducer,
  edge: fromEdge.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

// selectors
export const getAllNodes = createSelector(
  (state: State) => state.node,
  fromNode.selectAll
);

export const getAllEdges = createSelector(
  (state: State) => state.edge,
  fromEdge.selectAll
)

export const getSelectedNodes = createSelector(
  (state: State) => state.node,
  fromNode.getSelected
);
