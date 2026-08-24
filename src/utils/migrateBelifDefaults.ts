import { UserProduct } from '../types/product';

const PRODUCTS_KEY = 'bazen_kalkulator_products_list';
const MIGRATION_KEY = 'bazen_kalkulator_belif_defaults_v3';
const BELIF_MANUFACTURER_ID = 'mfg_belif_doo';

/**
 * Jednokratno ispravlja ugrađene BELIF proizvode u već postojećoj lokalnoj bazi.
 *
 * Važno: nakon ove migracije korisnik može normalno ručno mijenjati svaki proizvod.
 * Migracija se više nikada ne izvršava jer se čuva verzija u localStorage-u.
 */
export function migrateBelifDefaultProducts(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    if (localStorage.getItem(MIGRATION_KEY) === 'true') return;

    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(MIGRATION_KEY, 'true');
      return;
    }

    const products = JSON.parse(raw) as UserProduct[];
    const now = new Date().toISOString();

    const updates: Record<string, UserProduct['dosage']> = {
      prod_belif_ph_minus: {
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
      prod_belif_algaecide: {
        dosageType: 'standard',
        minAmount: 0.1,
        maxAmount: 0.5,
        amount: 0.3,
        calculatorAmount: 0.3,
        unit: 'l',
        targetVolume: 10,
        volumeUnit: 'm³',
        frequency: 'custom_days',
        frequencyDays: 7,
      },
      prod_belif_flocculant: {
        dosageType: 'standard',
        minAmount: 0.02,
        maxAmount: 0.05,
        amount: 0.035,
        calculatorAmount: 0.035,
        unit: 'l',
        targetVolume: 10,
        volumeUnit: 'm³',
        frequency: 'weekly',
      },
      prod_belif_crystallizer: {
        dosageType: 'standard',
        minAmount: 0.01,
        maxAmount: 0.05,
        amount: 0.03,
        calculatorAmount: 0.03,
        unit: 'l',
        targetVolume: 10,
        volumeUnit: 'm³',
        frequency: 'weekly',
      },
      prod_belif_chlorine_tablets_20g: {
        dosageType: 'standard',
        minAmount: 1,
        maxAmount: null,
        amount: 1,
        calculatorAmount: 1,
        unit: 'tableta',
        targetVolume: 2,
        volumeUnit: 'm³',
        frequency: 'weekly',
      },
      prod_belif_chlorine_granules: {
        dosageType: 'standard',
        minAmount: 3,
        maxAmount: null,
        amount: 3,
        calculatorAmount: 3,
        unit: 'g',
        targetVolume: 1,
        volumeUnit: 'm³',
        frequency: 'weekly',
      },
      prod_belif_chlorine_tablets_200g: {
        dosageType: 'standard',
        minAmount: 1,
        maxAmount: null,
        amount: 1,
        calculatorAmount: 1,
        unit: 'tableta',
        targetVolume: 30,
        volumeUnit: 'm³',
        frequency: 'weekly',
      },
      prod_belif_multi_tablets_20g: {
        dosageType: 'standard',
        minAmount: 1,
        maxAmount: null,
        amount: 1,
        calculatorAmount: 1,
        unit: 'tableta',
        targetVolume: 2,
        volumeUnit: 'm³',
        frequency: 'weekly',
      },
      prod_belif_multi_tablets_200g: {
        dosageType: 'standard',
        minAmount: 1,
        maxAmount: null,
        amount: 1,
        calculatorAmount: 1,
        unit: 'tableta',
        targetVolume: 20,
        volumeUnit: 'm³',
        frequency: 'weekly',
      },
      prod_belif_ph_plus: {
        dosageType: 'ph_correction',
        minAmount: 10,
        maxAmount: null,
        amount: 10,
        calculatorAmount: 10,
        unit: 'g',
        targetVolume: 1,
        volumeUnit: 'm³',
        frequency: 'once',
        phDirection: 'increase',
        phEffectMin: 0.1,
        phEffectMax: 0.15,
        phEffectAverage: 0.125,
      },
    };

    let changed = false;
    const updatedProducts = products.map((product) => {
      const nextDosage = updates[product.id];
      if (!nextDosage || product.manufacturerId !== BELIF_MANUFACTURER_ID) {
        return product;
      }
      changed = true;
      return {
        ...product,
        dosage: nextDosage,
        updatedAt: now,
      };
    });

    if (changed) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    }

    localStorage.setItem(MIGRATION_KEY, 'true');
  } catch (err) {
    console.error('Greška pri migraciji BELIF defaultnih proizvoda:', err);
  }
}
