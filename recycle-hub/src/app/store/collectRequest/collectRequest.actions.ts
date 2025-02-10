import { createAction, props } from '@ngrx/store';
import { CollectRequest } from '../../shared/models/collectRequest';

// Charger les demandes
export const loadCollectRequests = createAction('[Collect] Load Requests');
export const loadCollectRequestsSuccess = createAction(
  '[Collect] Load Requests Success',
  props<{ requests: CollectRequest[] }>()
);
export const loadCollectRequestsFailure = createAction(
  '[Collect] Load Requests Failure',
  props<{ error: string }>()
);

export const loadUserCollectRequests = createAction(
    '[Collect] Load User Requests',
    props<{ userId: string }>()
  );
  
  export const loadCollectorCollectRequests = createAction(
    '[Collect] Load Collector Requests',
    props<{ city: string }>()
  );

// Ajouter une demande
export const addCollectRequest = createAction(
  '[Collect] Add Request',
  props<{ request: CollectRequest }>()
);
export const addCollectRequestSuccess = createAction(
  '[Collect] Add Request Success',
  props<{ request: CollectRequest }>()
);

export const addCollectRequestError = createAction(
    '[Collect] Add Request Error',
    props<{ errorType: 'maxRequests' | 'maxWeight' }>()
  );

  export const addCollectRequestFailure = createAction(
    '[Collect] Add Request Failure',
    props<{ error: string }>()
  );

  export const resetAddRequestError = createAction('[Collect] Reset Add Request Error');

// Modifier une demande
export const updateCollectRequest = createAction(
  '[Collect] Update Request',
  props<{ request: CollectRequest }>()
);

// Supprimer une demande
export const deleteCollectRequest = createAction(
  '[Collect] Delete Request',
  props<{ id: string }>()
);

// Sélectionner une demande
export const selectCollectRequest = createAction(
  '[Collect] Select Request',
  props<{ id: string | null }>()
);

