import { WasteType } from "./enums";
import { CollectRequestStatus } from "./enums";

export interface CollectRequest {
  id: string;
  userId: string;
  collectorId?: string; 
  
  wasteTypes: WasteType[]; 
  wasteWeights: { [key in WasteType]?: number }; 
  
  estimatedWeight: number; 
  actualWeight?: number;  
  
  address: string;
  date: Date;
  timeSlot: string;
  
  status: CollectRequestStatus; 
}
