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
 *
 * 1. pH-
 * 2. Algicid
 * 3. Flokulant
 * 4. Kristal
 * 5. Hlor tablete 20 g
 * 6. Hlor granule
 * 7. Hlor tablete 200 g
 * 8. Multi tablete 20 g
 * 9. Multi tablete 200 g
 * 10. pH+
 */
export const DEFAULT_SEED_PRODUCTS: UserProduct[] = [
  // 1. pH-
  {
    id: 'prod_belif_ph_minus',
    manufacturerId: DEFAULT_SEED_MANUFACTURER_ID,
    manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME,
    categoryId: 'ph_minus',
    categoryTitle: 'pH-',
    dosage: {
      dosageType: 'ph_correction',
      minAmount: 0.1,
      maxAmount: null,
      amount: 0.1,
      calculatorAmount: 0.1,
      unit: 'l',
      targetVolume: 10,
      volumeUnit: 'm³',
      frequency: 'once',
      phDirection: 'decrease',
      phEffectMin: 0.1,
      phEffectMax: 0.15,
      phEffectAverage: 0.125,
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // 2. Algicid
  {
    id: 'prod_belif_algaecide',
    manufacturerId: DEFAULT_SEED_MANUFACTURER_ID,
    manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME,
    categoryId: 'algaecide',
    categoryTitle: 'Algicid',
    dosage: {
      dosageType: 'standard',
      minAmount: 50,
      maxAmount: 100,
      amount: 75,
      calculatorAmount: 75,
      unit: 'ml',
      targetVolume: 10,
      volumeUnit: 'm³',
      frequency: 'custom_days',
      frequencyDays: 7,
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // 3. Flokulant
  {
    id: 'prod_belif_flocculant',
    manufacturerId: DEFAULT_SEED_MANUFACTURER_ID,
    manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME,
    categoryId: 'flocculant',
    categoryTitle: 'Flokulant',
    dosage: {
      dosageType: 'standard',
      minAmount: 50,
      maxAmount: 100,
      amount: 75,
      calculatorAmount: 75,
      unit: 'ml',
      targetVolume: 10,
      volumeUnit: 'm³',
      frequency: 'weekly',
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // 4. Kristal
  {
    id: 'prod_belif_crystallizer',
    manufacturerId: DEFAULT_SEED_MANUFACTURER_ID,
    manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME,
    categoryId: 'crystallizer',
    categoryTitle: 'Kristal',
    dosage: {
      dosageType: 'standard',
      minAmount: 50,
      maxAmount: 100,
      amount: 75,
      calculatorAmount: 75,
      unit: 'ml',
      targetVolume: 10,
      volumeUnit: 'm³',
      frequency: 'weekly',
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // 5. Hlor tablete 20 g
  {
    id: 'prod_belif_chlorine_tablets_20g',
    manufacturerId: DEFAULT_SEED_MANUFACTURER_ID,
    manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME,
    categoryId: 'chlorine_tablets_20g',
    categoryTitle: 'Hlor tablete 20 g',
    dosage: {
      dosageType: 'standard',
      minAmount: 15,
      maxAmount: 20,
      amount: 18,
      calculatorAmount: 18,
      unit: 'tableta',
      targetVolume: 10,
      volumeUnit: 'm³',
      frequency: 'weekly',
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // 6. Hlor granule
  {
    id: 'prod_belif_chlorine_granules',
    manufacturerId: DEFAULT_SEED_MANUFACTURER_ID,
    manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME,
    categoryId: 'chlorine_granules',
    categoryTitle: 'Hlor granule',
    dosage: {
      dosageType: 'standard',
      minAmount: 100,
      maxAmount: null,
      amount: 100,
      calculatorAmount: 100,
      unit: 'g',
      targetVolume: 10,
      volumeUnit: 'm³',
      frequency: 'weekly',
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // 7. Hlor tablete 200 g
  {
    id: 'prod_belif_chlorine_tablets_200g',
    manufacturerId: DEFAULT_SEED_MANUFACTURER_ID,
    manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME,
    categoryId: 'chlorine_tablets_200g',
    categoryTitle: 'Hlor tablete 200 g',
    dosage: {
      dosageType: 'standard',
      minAmount: 1,
      maxAmount: 2,
      amount: 2,
      calculatorAmount: 2,
      unit: 'tableta',
      targetVolume: 20,
      volumeUnit: 'm³',
      frequency: 'weekly',
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // 8. Multi tablete 20 g
  {
    id: 'prod_belif_multi_tablets_20g',
    manufacturerId: DEFAULT_SEED_MANUFACTURER_ID,
    manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME,
    categoryId: 'multi_tablets_20g',
    categoryTitle: 'Multi tablete 20 g',
    dosage: {
      dosageType: 'standard',
      minAmount: 15,
      maxAmount: 20,
      amount: 18,
      calculatorAmount: 18,
      unit: 'tableta',
      targetVolume: 10,
      volumeUnit: 'm³',
      frequency: 'weekly',
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // 9. Multi tablete 200 g
  {
    id: 'prod_belif_multi_tablets_200g',
    manufacturerId: DEFAULT_SEED_MANUFACTURER_ID,
    manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME,
    categoryId: 'multi_tablets_200g',
    categoryTitle: 'Multi tablete 200 g',
    dosage: {
      dosageType: 'standard',
      minAmount: 1,
      maxAmount: 2,
      amount: 2,
      calculatorAmount: 2,
      unit: 'tableta',
      targetVolume: 20,
      volumeUnit: 'm³',
      frequency: 'weekly',
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // 10. pH+
  {
    id: 'prod_belif_ph_plus',
    manufacturerId: DEFAULT_SEED_MANUFACTURER_ID,
    manufacturerName: DEFAULT_SEED_MANUFACTURER_NAME,
    categoryId: 'ph_plus',
    categoryTitle: 'pH+',
    dosage: {
      dosageType: 'ph_correction',
      minAmount: 100,
      maxAmount: null,
      amount: 100,
      calculatorAmount: 100,
      unit: 'g',
      targetVolume: 10,
      volumeUnit: 'm³',
      frequency: 'once',
      phDirection: 'increase',
      phEffectMin: 0.1,
      phEffectMax: 0.15,
      phEffectAverage: 0.125,
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];
