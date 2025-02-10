
import { CollectRequest } from "../../shared/models/collectRequest";
import { CollectRequestStatus } from "../../shared/models/enums";

export interface CollectState {
  collectRequests: CollectRequest[];
  isLoading: boolean;
  error: string | null;
  selectedRequestId: string | null;
  addRequestError: 'maxRequests' | 'maxWeight' | null;
}

export const initialCollectState: CollectState = {
  collectRequests: [],
  isLoading: false,
  error: null,
  selectedRequestId: null,
  addRequestError: null,
};