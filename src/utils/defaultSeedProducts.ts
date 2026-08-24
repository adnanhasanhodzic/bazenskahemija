import { Manufacturer, UserProduct } from '../types/product';

export const DEFAULT_SEED_MANUFACTURER_ID = 'mfg_belif_doo';
export const DEFAULT_SEED_MANUFACTURER_NAME = 'BELIF d.o.o.';

/**
 * Ugrađeni podaci za početnog proizvođača "BELIF d.o.o."
 */
export const DEFAULT_SEED_MANUFACTURER: Manufacturer = {
  id: DEFAULT_SEED_MANUFACTURER_ID,
  name: DEFAULT_SEED_MANUFACTURER_NAME,
  createdAt: '2026-01-01T00:00:00.000Z',
};

/**
 * Ugrađena početna baza 10 proizvoda proizvođača "BELIF d.o.o."
 * sa tačnim nazivima, doziranjem, rasponima i specifikacijama.
 */
export const DEFAULT_SEED_PRODUCTS: UserProduct[] = [
  {
    id: 'prod_belif_ph_minus', manufacturerId: DEFAULT_SEED_MANUFACTURER_ID, manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME, categoryId: 'ph_minus', categoryTitle: 'pH-',
    dosage: { dosageType: 'ph_correction', minAmount: 0.1, maxAmount: null, amount: 0.1, calculatorAmount: 0.1, unit: 'l', targetVolume: 10, volumeUnit: 'm³', frequency: 'once', phDirection: 'decrease', phEffectMin: 0.1, phEffectMax: 0.15, phEffectAverage: 0.125 },
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_belif_algaecide', manufacturerId: DEFAULT_SEED_MANUFACTURER_ID, manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME, categoryId: 'algaecide', categoryTitle: 'Algicid',
    dosage: { dosageType: 'standard', minAmount: 0.1, maxAmount: null, amount: 0.1, calculatorAmount: 0.1, unit: 'l', targetVolume: 10, volumeUnit: 'm³', frequency: 'custom_days', frequencyDays: 7 },
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_belif_flocculant', manufacturerId: DEFAULT_SEED_MANUFACTURER_ID, manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME, categoryId: 'flocculant', categoryTitle: 'Flokulant',
    dosage: { dosageType: 'standard', minAmount: 0.02, maxAmount: 0.05, amount: 0.035, calculatorAmount: 0.035, unit: 'l', targetVolume: 10, volumeUnit: 'm³', frequency: 'weekly' },
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_belif_crystallizer', manufacturerId: DEFAULT_SEED_MANUFACTURER_ID, manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME, categoryId: 'crystallizer', categoryTitle: 'Kristal',
    dosage: { dosageType: 'standard', minAmount: 0.01, maxAmount: 0.05, amount: 0.03, calculatorAmount: 0.03, unit: 'l', targetVolume: 10, volumeUnit: 'm³', frequency: 'weekly' },
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_belif_chlorine_tablets_20g', manufacturerId: DEFAULT_SEED_MANUFACTURER_ID, manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME, categoryId: 'chlorine_tablets_20g', categoryTitle: 'Hlor tablete 20 g',
    dosage: { dosageType: 'standard', minAmount: 1, maxAmount: null, amount: 1, calculatorAmount: 1, unit: 'tableta', targetVolume: 3, volumeUnit: 'm³', frequency: 'weekly' },
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_belif_chlorine_granules', manufacturerId: DEFAULT_SEED_MANUFACTURER_ID, manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME, categoryId: 'chlorine_granules', categoryTitle: 'Hlor granule',
    dosage: { dosageType: 'standard', minAmount: 3, maxAmount: null, amount: 3, calculatorAmount: 3, unit: 'g', targetVolume: 1, volumeUnit: 'm³', frequency: 'weekly' },
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_belif_chlorine_tablets_200g', manufacturerId: DEFAULT_SEED_MANUFACTURER_ID, manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME, categoryId: 'chlorine_tablets_200g', categoryTitle: 'Hlor tablete 200 g',
    dosage: { dosageType: 'standard', minAmount: 1, maxAmount: null, amount: 1, calculatorAmount: 1, unit: 'tableta', targetVolume: 30, volumeUnit: 'm³', frequency: 'weekly' },
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_belif_multi_tablets_20g', manufacturerId: DEFAULT_SEED_MANUFACTURER_ID, manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME, categoryId: 'multi_tablets_20g', categoryTitle: 'Multi tablete 20 g',
    dosage: { dosageType: 'standard', minAmount: 1, maxAmount: null, amount: 1, calculatorAmount: 1, unit: 'tableta', targetVolume: 2, volumeUnit: 'm³', frequency: 'weekly' },
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_belif_multi_tablets_200g', manufacturerId: DEFAULT_SEED_MANUFACTURER_ID, manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME, categoryId: 'multi_tablets_200g', categoryTitle: 'Multi tablete 200 g',
    dosage: { dosageType: 'standard', minAmount: 1, maxAmount: null, amount: 1, calculatorAmount: 1, unit: 'tableta', targetVolume: 20, volumeUnit: 'm³', frequency: 'weekly' },
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_belif_ph_plus', manufacturerId: DEFAULT_SEED_MANUFACTURER_ID, manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME, categoryId: 'ph_plus', categoryTitle: 'pH+',
    dosage: { dosageType: 'ph_correction', minAmount: 10, maxAmount: null, amount: 10, calculatorAmount: 10, unit: 'g', targetVolume: 1, volumeUnit: 'm³', frequency: 'once', phDirection: 'increase', phEffectMin: 0.1, phEffectMax: 0.15, phEffectAverage: 0.125 },
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  },
];
