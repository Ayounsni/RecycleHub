// store/user/user.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/user';


// Charger les utilisateurs
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: string }>()
);

// Ajouter un utilisateur
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

// user.actions.ts
export const rehydrateUser = createAction(
  '[User] Rehydrate User',
  props<{ user: User }>()
);
export const loadCurrentUser = createAction('[User] Load Current User');

// Déconnexion
export const logoutUser = createAction('[User] Logout User');


// Modifier un utilisateur
export const updateUser = createAction(
  '[User] Update User',
  props<{ user: User }>()
);

// Supprimer un utilisateur
export const deleteUser = createAction(
  '[User] Delete User',
  props<{ id: string }>()
);

// Sélectionner un utilisateur pour modification
export const selectUser = createAction(
  '[User] Select User',
  props<{ id: string | null }>()
);