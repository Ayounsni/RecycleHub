// store/user/user.effects.ts
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
            // On crée une nouvelle liste en ajoutant l'utilisateur
            const updatedUsers = [...users, user];
            // On met à jour le localStorage avec la liste modifiée
            this.storageService.saveToLocalStorage('users', updatedUsers);
            // On retourne l'action loadUsersSuccess avec la liste mise à jour
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
        // Redirige vers la page de login
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false } // Cet effet n'a pas besoin de dispatcher une action
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
        // Sauvegarde de l'utilisateur connecté dans le localStorage
        this.storageService.saveToLocalStorage('currentUser', user);
        // Redirection selon le rôle de l'utilisateur
        if (user.role === 'user' ) {
          this.router.navigate(['/profile']);
        } else if ( user.role === 'collector') {
          this.router.navigate(['/profile']);
        } else {
          // Route par défaut si aucun rôle connu n'est trouvé
          this.router.navigate(['/dashboard']);
        }
      })
    ),
    { dispatch: false } // Cet effet n'a pas besoin de dispatcher une action
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

  // Ajoutez cet effet dans votre fichier user.effects.ts
logoutUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UserActions.logoutUser), // Écoute l'action de déconnexion
    tap(() => {
      // Supprime l'utilisateur actuel du localStorage
      this.storageService.removeFromLocalStorage('currentUser');
      // Redirige vers la page de connexion
      this.router.navigate(['/login']);
    })
  ),
  { dispatch: false } // Cet effet ne dispatche pas d'autre action
);

updateUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UserActions.updateUser),
    tap(({ user }) => {
      // Mise à jour localStorage via le service
      this.storageService.updateUserInLocalStorage(user);
    })
  ),
  { dispatch: false }
);

deleteUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UserActions.deleteUser),
    tap(({ id }) => {
      // Supprimez l'utilisateur du localStorage
      this.storageService.removeUserFromLocalStorage(id);
      this.storageService.removeFromLocalStorage('currentUser');
    })
  ),
  { dispatch: false }
);
}