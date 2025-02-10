import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { userReducer } from './store/user/user.reducer';
import { UserEffects } from './store/user/user.effects';
import { provideState } from '@ngrx/store';

import { routes } from './app.routes';
import { CollectEffects } from './store/collectRequest/collectRequest.effects';
import { collectReducer } from './store/collectRequest/collectRequest.reducer';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideStore(),
    provideState({ name: 'user', reducer: userReducer }), 
    provideState({ name: 'collect', reducer: collectReducer, }),
    provideEffects([UserEffects , CollectEffects]),
  ]
};
