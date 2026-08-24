/**
 * Pool domain types and data models
 */

export type PoolShape = 'round' | 'rectangular' | 'oval';

export interface PoolDimensionsCm {
  shape: PoolShape;
  // Round pool
  diameter?: number; // in cm
  // Rectangular / Oval pool
  length?: number; // in cm
  width?: number; // in cm
  // Depth / Height
  height: number; // in cm
  // Water fill percentage (50 - 100%, default 90%)
  fillPercentage: number;
}

export interface Pool {
  id: string;
  name: string; // e.g. "Kućni bazen", "Vikendica"
  shape: PoolShape;
  // Centimeter dimensions entered by user
  diameter?: number; // in cm
  length?: number; // in cm
  width?: number; // in cm
  height: number; // in cm
  fillPercentage: number; // e.g. 90
  /** Total physical geometric volume in liters (L) */
  totalVolumeLiters: number;
  /** Active working volume based on fillPercentage in liters (L) */
  workingVolumeLiters: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChemistryProduct {
  id: string;
  name: string;
  category: 'ph_minus' | 'ph_plus' | 'chlorine_granules' | 'chlorine_tablets' | 'algaecide' | 'flocculant';
  manufacturer?: string;
  dosagePer10m3: number;
  unit: 'g' | 'ml' | 'tablets';
  description: string;
}
