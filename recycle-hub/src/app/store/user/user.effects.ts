import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as UserActions from './user.actions';
import { StorageService } from '../../core/services/storage.service';
import { User } from '../../shared/models/user';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions); 
  constructor(private storageService: StorageService, private router: Router) {}

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addUser),
      mergeMap(({ user }) =>
        of(this.storageService.getArrayFromLocalStorage<User>('users') || []).pipe(
          map((users) => {
            const updatedUsers = [...users, user];
            this.storageService.saveToLocalStorage('users', updatedUsers);
            return UserActions.addUserSuccess({ user });
                    }),
          catchError((error) => of(UserActions.loadUsersFailure({ error })))
        )
      )
    )
  );
  redirectAfterRegister$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addUserSuccess),
      tap(() => {
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false } 
  );

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

  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loginUser),
      mergeMap(({ email, password }) => {
        const users = this.storageService.getArrayFromLocalStorage<User>('users') || [];
        const user = users.find(u => u.email === email && u.password === password);
        return user
          ? of(UserActions.loginUserSuccess({ user }))
          : of(UserActions.loginUserFailure({ error: 'Identifiants incorrects. Veuillez réessayer.' }));
      })
    )
  );

  redirectAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loginUserSuccess),
      tap(({ user }) => {
        this.storageService.saveToLocalStorage('currentUser', user);
        if (user.role === 'user' ) {
          this.router.navigate(['/dashboard-particulier']);
        } else if ( user.role === 'collector') {
          this.router.navigate(['/dashboard-collecteur']);
        } else {
          this.router.navigate(['/login']);
        }
      })
    ),
    { dispatch: false } 
  );

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadCurrentUser),
      mergeMap(() => {
        const user = this.storageService.getFromLocalStorage<User>('currentUser');
        return user
          ? of(UserActions.loginUserSuccess({ user }))
          : of();
      })
    )
  );

logoutUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UserActions.logoutUser), 
    tap(() => {
      this.storageService.removeFromLocalStorage('currentUser');
      this.router.navigate(['/login']);
    })
  ),
  { dispatch: false }
);

updateUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UserActions.updateUser),
    tap(({ user }) => {
      this.storageService.updateUserInLocalStorage(user);
    })
  ),
  { dispatch: false }
);

deleteUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UserActions.deleteUser),
    tap(({ id }) => {
      this.storageService.removeUserFromLocalStorage(id);
      this.storageService.removeFromLocalStorage('currentUser');
    })
  ),
  { dispatch: false }
);

updateUserPoints$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UserActions.updateUserPoints),
    mergeMap(({ userId, points }) => {
      const users = this.storageService.getArrayFromLocalStorage<User>('users') || [];
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, points: (user.points || 0) + points } : user
      );

      this.storageService.saveToLocalStorage('users', updatedUsers);

      let updatedCurrentUser = this.storageService.getFromLocalStorage<User>('currentUser');
      if (updatedCurrentUser && updatedCurrentUser.id === userId) {
        updatedCurrentUser = { ...updatedCurrentUser, points: (updatedCurrentUser.points || 0) + points };
        this.storageService.saveToLocalStorage('currentUser', updatedCurrentUser);
      }

      return of(UserActions.updateUserPointsSuccess({ userId, points }));
    }),
    catchError(error => of(UserActions.updateUserPointsFailure({ error })))
  )
);

}