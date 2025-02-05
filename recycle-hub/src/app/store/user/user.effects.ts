// store/user/user.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as UserActions from './user.actions';
import { StorageService } from '../../core/services/storage.service';
import { User } from '../../shared/models/user';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);  // Injection via `inject()`
  constructor(private storageService: StorageService) {
    console.log('Actions:', this.actions$); // Pour vérifier qu'il n'est pas undefined
  }

  // Charger les utilisateurs depuis LocalStorage
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      tap(() => console.log('✅ Action loadUsers détectée')),
      mergeMap(() =>
        of(this.storageService.getArrayFromLocalStorage<User>('users') || []).pipe(
          tap((users) => console.log('✅ Utilisateurs récupérés:', users)),
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => {
            console.error('❌ Erreur dans loadUsers$:', error);
            return of(UserActions.loadUsersFailure({ error }));
          })
        )
      )
    )
  );
}