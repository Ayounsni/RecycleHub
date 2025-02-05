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