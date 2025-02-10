import { createReducer, on } from '@ngrx/store';
import { CollectState, initialCollectState } from './collectRequest.state';
import * as CollectActions from './collectRequest.actions';

export const collectReducer = createReducer(
  initialCollectState,
  on(CollectActions.loadCollectRequests, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(CollectActions.loadCollectRequestsSuccess, (state, { requests }) => ({
    ...state,
    collectRequests: requests,
    isLoading: false,
  })),
  on(CollectActions.loadCollectRequestsFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(CollectActions.addCollectRequestError, (state, { errorType }) => ({
    ...state,
    addRequestError: errorType, 
  })),
  on(CollectActions.resetAddRequestError, (state) => ({
    ...state,
    addRequestError: null, 
  })),
  on(CollectActions.addCollectRequestSuccess, (state, { request }) => ({
    ...state,
    collectRequests: [...state.collectRequests, request],
  })),
  on(CollectActions.updateCollectRequest, (state, { request }) => ({
    ...state,
    collectRequests: state.collectRequests.map(r => r.id === request.id ? request : r),
  })),
  on(CollectActions.deleteCollectRequest, (state, { id }) => ({
    ...state,
    collectRequests: state.collectRequests.filter(r => r.id !== id),
  })),
  on(CollectActions.selectCollectRequest, (state, { id }) => ({
    ...state,
    selectedRequestId: id,
  }))
);