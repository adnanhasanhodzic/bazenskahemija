import { PoolShape } from '../types/pool';

/**
 * Calculates the total physical volume in liters based on shape and dimensions in centimeters.
 */
export function calculateTotalVolumeLiters(
  shape: PoolShape,
  dimensions: {
    diameter?: number; // cm
    length?: number; // cm
    width?: number; // cm
    height: number; // cm
  }
): number {
  const { diameter = 0, length = 0, width = 0, height = 0 } = dimensions;

  if (height <= 0) return 0;

  const hMeters = height / 100;

  if (shape === 'round') {
    if (diameter <= 0) return 0;
    const rMeters = diameter / 200; // (diameter / 100) / 2
    // V = π * r² * h (in m³)
    const volumeM3 = Math.PI * Math.pow(rMeters, 2) * hMeters;
    // 1 m³ = 1000 Liters
    return Math.round((volumeM3 * 1000) / 10) * 10;
  }

  if (shape === 'rectangular') {
    if (length <= 0 || width <= 0) return 0;
    const lMeters = length / 100;
    const wMeters = width / 100;
    // V = length * width * height (in m³)
    const volumeM3 = lMeters * wMeters * hMeters;
    return Math.round((volumeM3 * 1000) / 10) * 10;
  }

  if (shape === 'oval') {
    if (length <= 0 || width <= 0) return 0;
    const aMeters = length / 200; // semi-major axis
    const bMeters = width / 200;  // semi-minor axis
    // V = π * (L/2) * (W/2) * h (in m³)
    const volumeM3 = Math.PI * aMeters * bMeters * hMeters;
    return Math.round((volumeM3 * 1000) / 10) * 10;
  }

  return 0;
}

/**
 * Calculates the working volume in liters based on total volume and fill percentage (e.g. 90%).
 */
export function calculateWorkingVolumeLiters(
  totalVolumeLiters: number,
  fillPercentage: number
): number {
  if (totalVolumeLiters <= 0 || fillPercentage <= 0) return 0;
  const rawWorking = totalVolumeLiters * (fillPercentage / 100);
  return Math.round(rawWorking / 10) * 10;
}

/**
 * Formats a number with thousands separators (dots) for display, e.g. 14220 -> "14.220"
 */
export function formatLiters(value: number): string {
  if (!value || isNaN(value)) return '0';
  // Use European formatting with dot as thousand separator
  return Math.round(value).toLocaleString('de-DE');
}
