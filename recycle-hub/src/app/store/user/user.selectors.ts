import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users
);

export const selectCurrentUserId = createSelector(
  selectUserState,
  (state) => state.users.find((u) => u.id === state.currentUserId)
);

export const selectCurrentUser = createSelector(
  selectUserState,
  (state) => state.currentUser
);

export const selectIsLoading = createSelector(
  selectUserState,
  (state) => state.isLoading
);

export const selectError = createSelector(
  selectUserState,
  (state) => state.error
);