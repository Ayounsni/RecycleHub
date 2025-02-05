// store/user/user.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as UserActions from './user.actions';
import { StorageService } from '../../core/services/storage.service';
import { User } from '../../shared/models/user';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions); 
  constructor(private storageService: StorageService) {}

  // Charger les utilisateurs depuis LocalStorage
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        of(this.storageService.getArrayFromLocalStorage<User>('users') || []).pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => of(UserActions.loadUsersFailure({ error })))
        )
      )
    )
  );
}