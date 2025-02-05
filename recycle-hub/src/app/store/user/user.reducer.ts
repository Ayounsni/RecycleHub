// store/user/user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { UserState, initialUserState } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,
  // Charger les utilisateurs
  on(UserActions.loadUsers, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    isLoading: false,
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  // Ajouter un utilisateur
  on(UserActions.addUser, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
  })),

  // Modifier un utilisateur
  on(UserActions.updateUser, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
  })),

  // Supprimer un utilisateur
  on(UserActions.deleteUser, (state, { id }) => ({
    ...state,
    users: state.users.filter((u) => u.id !== id),
  })),

  // Sélectionner un utilisateur
  on(UserActions.selectUser, (state, { id }) => ({
    ...state,
    currentUserId: id,
  }))
);