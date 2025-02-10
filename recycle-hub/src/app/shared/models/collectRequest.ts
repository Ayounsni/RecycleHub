import { WasteType } from "./enums";
import { CollectRequestStatus } from "./enums";

export interface CollectRequest {
  id: string;
  userId: string;
  collectorId?: string; 
  wasteTypes: WasteType;   
  estimatedWeight: number; 
  actualWeight?: number;  
  address: string;
  date: Date;
  timeSlot: string;
  city?: string;
  status: CollectRequestStatus; 
}
