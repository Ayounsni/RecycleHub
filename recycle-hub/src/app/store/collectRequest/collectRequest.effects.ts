import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import * as CollectActions from './collectRequest.actions';
import { StorageService } from '../../core/services/storage.service';
import { CollectRequest } from '../../shared/models/collectRequest';
import { selectCurrentUser } from '../user/user.selectors';
import { Store } from '@ngrx/store';
import { selectAllCollectRequests, selectUserCollectRequests } from './collectRequest.selectors';
import { updateUserPoints } from '../user/user.actions';

const calculatePoints = (wasteType: string, weightGrams: number): number => {
    const weightKg = weightGrams / 1000;
    const pointsMap: { [key: string]: number } = {
      'plastic': 2,
      'glass': 1,
      'paper': 1,
      'metal': 5
    };
    const key = wasteType.toLowerCase();
    const pointsPerKg = pointsMap[key] || 0;
    const calculated = Math.round(pointsPerKg * weightKg);
    console.log(`Calculating points: wasteType=${wasteType}, key=${key}, weightKg=${weightKg}, pointsPerKg=${pointsPerKg}, calculated=${calculated}`);
    return calculated;
  };

@Injectable()
export class CollectEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  constructor(private storageService: StorageService) {}

  loadRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectActions.loadCollectRequests),
      mergeMap(() =>
        of(this.storageService.getArrayFromLocalStorage<CollectRequest>('collectRequests') || []).pipe(
          map((requests) => CollectActions.loadCollectRequestsSuccess({ requests })),
          catchError((error) => of(CollectActions.loadCollectRequestsFailure({ error })))
        )
      )
    )
  );

  loadUserRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectActions.loadUserCollectRequests),
      mergeMap(({ userId }) => {
        const key = `collectRequests`;
        const allRequests = this.storageService.getArrayFromLocalStorage<CollectRequest>((key)) || [];
        const userRequests = allRequests.filter(r => r.userId === userId);
        return of(CollectActions.loadCollectRequestsSuccess({ requests: userRequests }));
      })
    )
  );
  
  loadCollectorRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectActions.loadCollectorCollectRequests),
      mergeMap(({ city }) => {
        const allRequests = this.storageService.getArrayFromLocalStorage<CollectRequest>('collectRequests') || [];
        const collectorRequests = allRequests.filter(r => r.city === city);
        return of(CollectActions.loadCollectRequestsSuccess({ requests: collectorRequests }));
      })
    )
  );

  addRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectActions.addCollectRequest),
      withLatestFrom(
        this.store.select(selectCurrentUser),
        this.store.select(selectUserCollectRequests),
        this.store.select(selectAllCollectRequests)
      ),
      mergeMap(([{ request }, user, userRequests]) => {
        if (!user) {
          return of(CollectActions.addCollectRequestFailure({ error: 'No user logged in' }));
        }
  
        const pendingOrRejected = userRequests.filter(r => 
          r.status === 'pending' || r.status === 'rejected'
        );
  
        if (pendingOrRejected.length >= 3) {
          return of(CollectActions.addCollectRequestError({ errorType: 'maxRequests' }));
        }
  
        const totalWeight = pendingOrRejected.reduce((sum, r) => sum + r.estimatedWeight, 0);
        if (totalWeight + request.estimatedWeight > 10000) {
          return of(CollectActions.addCollectRequestError({ errorType: 'maxWeight' }));
        }
    
        const newRequest = { 
          ...request,
          id: Date.now().toString(),
          userId: user.id 
        };
  
            const existingRequests = this.storageService.getFromLocalStorage('collectRequests');
            const requestsArray = Array.isArray(existingRequests) ? existingRequests : []; 

            const updatedRequests = [...requestsArray, newRequest];

        this.storageService.saveToLocalStorage('collectRequests', updatedRequests);
  
        return of(CollectActions.addCollectRequestSuccess({ request: newRequest }));
      }),
      catchError(error => {
        console.error('Erreur lors de l\'ajout:', error);
        return of(CollectActions.addCollectRequestFailure({ error }));
      })
    )
  );
  
  

  updateRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectActions.updateCollectRequest),
      tap(({ request }) => {
        const allRequests = this.storageService.getArrayFromLocalStorage<CollectRequest>('collectRequests') || [];
        const previousRequest = allRequests.find(r => r.id === request.id);
  
        if (request.status === 'validated') {
          const points = calculatePoints(request.wasteTypes, request.estimatedWeight);
          
          this.store.dispatch(updateUserPoints({ 
            userId: request.userId, 
            points 
          }));
  
          const updatedRequest = { ...request, pointsAwarded: true };
          const updatedRequests = allRequests.map(r => 
            r.id === request.id ? updatedRequest : r
          );
          this.storageService.saveToLocalStorage('collectRequests', updatedRequests);
        } else {
          // Mise à jour normale
          const updatedRequests = allRequests.map(r => 
            r.id === request.id ? request : r
          );
          this.storageService.saveToLocalStorage('collectRequests', updatedRequests);
        }
      })
    ),
    { dispatch: false }
  );

  deleteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectActions.deleteCollectRequest),
      tap(({ id }) => {
        const requests = this.storageService.getArrayFromLocalStorage<CollectRequest>('collectRequests') || [];
        const updatedRequests = requests.filter(r => r.id !== id);
        this.storageService.saveToLocalStorage('collectRequests', updatedRequests);
      })
    ),
    { dispatch: false }
  );
}