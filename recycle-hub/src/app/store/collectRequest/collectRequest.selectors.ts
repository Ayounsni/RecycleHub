import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectState } from './collectRequest.state';
import { selectCurrentUser } from '../user/user.selectors';

export const selectCollectState = createFeatureSelector<CollectState>('collect');

export const selectAllCollectRequests = createSelector(
  selectCollectState,
  (state) => state.collectRequests
);

export const selectUserCollectRequests = createSelector(
  selectAllCollectRequests,
  selectCurrentUser,
  (requests, user) => requests.filter(r => r.userId === user?.id)
);

export const selectSelectedCollectRequest = createSelector(
  selectCollectState,
  (state) => state.collectRequests.find(r => r.id === state.selectedRequestId)
);

export const selectIsLoadingCollect = createSelector(
  selectCollectState,
  (state) => state.isLoading
);

export const selectCollectorCollectRequests = createSelector(
    selectAllCollectRequests,
    selectCurrentUser,
    (requests, user) => {
      if (!user || user.role !== 'collector' || !user.city) return [];
      return requests.filter(r => r.city === user.city);
    }
  );

  export const selectAddRequestError = createSelector(
    selectCollectState, 
    (state) => state.addRequestError 
  );

