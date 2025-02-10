import { createReducer, on } from '@ngrx/store';
import { UserState, initialUserState } from './user.state';
import * as UserActions from './user.actions';
import { User } from '../../shared/models/user';

export const userReducer = createReducer(
  initialUserState,
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
    error: error,
    isLoading: false,
  })),

  on(UserActions.loginUserFailure, (state, { error }) => ({
    ...state,
    error: error,
    isLoading: false,
  })),

  on(UserActions.addUser, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
  })),

  on(UserActions.updateUser, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    currentUser: state.currentUser && state.currentUser.id === user.id ? user : state.currentUser
  })),

  on(UserActions.loginUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    error: null,
  })),
  on(UserActions.rehydrateUser, (state, { user }) => ({
    ...state,
    currentUser: user
  })),
  on(UserActions.logoutUser, (state) => ({
    ...state,
    currentUser: null,
  })),

  on(UserActions.deleteUser, (state, { id }) => ({
    ...state,
    users: state.users.filter((u) => u.id !== id),
    currentUser: null,
  })),
  on(UserActions.updateUserPoints, (state, { userId, points }) => {
    const updateUser = (user: User) => ({
      ...user,
      points: (user.points || 0) + points
    });
  
    return {
      ...state,
      users: state.users.map(u => u.id === userId ? updateUser(u) : u),
      currentUser: state.currentUser?.id === userId 
        ? updateUser(state.currentUser) 
        : state.currentUser
    };
  }),

  on(UserActions.selectUser, (state, { id }) => ({
    ...state,
    currentUserId: id,
  }))
);