import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/user';


export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: string }>()
);

export const addUser = createAction(
  '[User] Add User',
  props<{ user: User }>()
);

export const addUserSuccess = createAction(
  '[User] Add User Success',
  props<{ user: User }>()
);

export const loginUser = createAction(
  '[User] Login User',
  props<{ email: string; password: string }>()
);
export const loginUserSuccess = createAction(
  '[User] Login User Success',
  props<{ user: User }>()
);
export const loginUserFailure = createAction(
  '[User] Login User Failure',
  props<{ error: string }>()
);

export const rehydrateUser = createAction(
  '[User] Rehydrate User',
  props<{ user: User }>()
);
export const loadCurrentUser = createAction('[User] Load Current User');

export const logoutUser = createAction('[User] Logout User');


export const updateUser = createAction(
  '[User] Update User',
  props<{ user: User }>()
);

export const deleteUser = createAction(
  '[User] Delete User',
  props<{ id: string }>()
);

export const selectUser = createAction(
  '[User] Select User',
  props<{ id: string | null }>()
);

export const updateUserPoints = createAction(
  '[User] Update Points',
  props<{ userId: string; points: number }>()
);

export const updateUserPointsSuccess = createAction(
  '[User] Update User Points Success',
  props<{ userId: string; points: number }>()
);

export const updateUserPointsFailure = createAction(
  '[User] Update User Points Failure',
  props<{ error: string }>()
);