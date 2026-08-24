export interface WaterTestRecord {
  id: string;
  poolId: string;
  date: string; // Format: YYYY-MM-DD
  ph: number;
  chlorine: number; // in ppm
  createdAt: string; // ISO timestamp
}

export type WaterParamStatus = 'below' | 'ideal' | 'above';

export interface WaterParamEvaluation {
  value: number;
  formattedValue: string;
  status: WaterParamStatus;
  statusText: string;
  badgeClass: string;
  iconSymbol: string;
  isIdeal: boolean;
}
