import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectCurrentUser } from '../../store/user/user.selectors';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectCurrentUser).pipe(
    take(1),
    map((user) => {
      if (user) {
        return true; 
      } else {
        if (state.url !== '/login') {
          router.navigate(['/login']); 
        }
        return false;
      }
    })
  );
};
