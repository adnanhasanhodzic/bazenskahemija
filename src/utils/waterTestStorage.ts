import { WaterTestRecord, WaterParamEvaluation } from '../types/waterTest';

const WATER_TESTS_STORAGE_KEY = 'bazen_water_tests_history_v1';

/**
 * Retrieves all stored water test records
 */
export function getAllWaterTests(): WaterTestRecord[] {
  try {
    const raw = localStorage.getItem(WATER_TESTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load water tests from localStorage:', err);
    return [];
  }
}

/**
 * Saves the full list of water tests to localStorage
 */
function saveAllWaterTests(tests: WaterTestRecord[]): void {
  try {
    localStorage.setItem(WATER_TESTS_STORAGE_KEY, JSON.stringify(tests));
  } catch (err) {
    console.error('Failed to persist water tests to localStorage:', err);
  }
}

/**
 * Retrieves all tests for a specific pool, sorted newest first
 */
export function getWaterTestsForPool(poolId: string): WaterTestRecord[] {
  if (!poolId) return [];
  const all = getAllWaterTests();
  const poolTests = all.filter((t) => t.poolId === poolId);
  return poolTests.sort((a, b) => {
    // Sort by date descending, then createdAt descending
    const dateComp = (b.date || '').localeCompare(a.date || '');
    if (dateComp !== 0) return dateComp;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
}

/**
 * Retrieves the latest test for a specific pool
 */
export function getLatestWaterTest(poolId: string): WaterTestRecord | null {
  const tests = getWaterTestsForPool(poolId);
  return tests.length > 0 ? tests[0] : null;
}

/**
 * Saves a new water test record for a pool
 */
export function saveWaterTest(record: {
  poolId: string;
  date: string;
  ph: number;
  chlorine: number;
}): WaterTestRecord {
  const all = getAllWaterTests();
  const newRecord: WaterTestRecord = {
    id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    poolId: record.poolId,
    date: record.date || getTodayFormattedIso(),
    ph: record.ph,
    chlorine: record.chlorine,
    createdAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...all];
  saveAllWaterTests(updated);
  return newRecord;
}

/**
 * Deletes a water test record by ID
 */
export function deleteWaterTest(testId: string): void {
  const all = getAllWaterTests();
  const updated = all.filter((t) => t.id !== testId);
  saveAllWaterTests(updated);
}

/**
 * Returns today's date in YYYY-MM-DD format
 */
export function getTodayFormattedIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats YYYY-MM-DD or ISO date string to Bosnian / European DD.MM.YYYY
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  // If it's already YYYY-MM-DD
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}.${month}.${year}`;
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Checks if a test date is older than 7 days
 */
export function isTestOutdated(dateStr: string): boolean {
  if (!dateStr) return true;
  try {
    const testDate = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(testDate.getTime())) return false;
    const now = new Date();
    const diffMs = now.getTime() - testDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays > 7;
  } catch {
    return false;
  }
}

/**
 * Evaluates pH value according to ideal range (7,2 – 7,6)
 */
export function evaluatePhValue(ph: number): WaterParamEvaluation {
  const formatted = ph.toFixed(1).replace('.', ',');
  if (ph < 7.2) {
    return {
      value: ph,
      formattedValue: formatted,
      status: 'below',
      statusText: 'Prenisko',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      iconSymbol: '🔵',
      isIdeal: false,
    };
  } else if (ph > 7.6) {
    return {
      value: ph,
      formattedValue: formatted,
      status: 'above',
      statusText: 'Previsoko',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      iconSymbol: '🔴',
      isIdeal: false,
    };
  }
  return {
    value: ph,
    formattedValue: formatted,
    status: 'ideal',
    statusText: 'U idealnom rasponu',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconSymbol: '🟢',
    isIdeal: true,
  };
}

/**
 * Evaluates Free Chlorine value according to ideal range (1,0 – 3,0 ppm)
 */
export function evaluateChlorineValue(chlorine: number): WaterParamEvaluation {
  const formatted = chlorine.toFixed(1).replace('.', ',');
  if (chlorine < 1.0) {
    return {
      value: chlorine,
      formattedValue: `${formatted} ppm`,
      status: 'below',
      statusText: 'Prenisko',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      iconSymbol: '🔵',
      isIdeal: false,
    };
  } else if (chlorine > 3.0) {
    return {
      value: chlorine,
      formattedValue: `${formatted} ppm`,
      status: 'above',
      statusText: 'Previsoko',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      iconSymbol: '🔴',
      isIdeal: false,
    };
  }
  return {
    value: chlorine,
    formattedValue: `${formatted} ppm`,
    status: 'ideal',
    statusText: 'U idealnom rasponu',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconSymbol: '🟢',
    isIdeal: true,
  };
}
