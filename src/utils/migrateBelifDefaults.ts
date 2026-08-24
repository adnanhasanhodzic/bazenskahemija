import { UserProduct } from '../types/product';

const PRODUCTS_KEY = 'bazen_kalkulator_products_list';
const MIGRATION_KEY = 'bazen_kalkulator_belif_algaecide_v1';
const BELIF_MANUFACTURER_ID = 'mfg_belif_doo';
const ALGAECIDE_ID = 'prod_belif_algaecide';

/**
 * Jednokratna migracija postojeće lokalne baze.
 * Ispravlja ISKLJUČIVO BELIF Algicid na 0,1 L / 10 m³.
 * Svi ostali proizvodi i sve korisničke izmjene ostaju netaknuti.
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
    let changed = false;

    const updatedProducts = products.map((product) => {
      if (
        product.id !== ALGAECIDE_ID ||
        product.manufacturerId !== BELIF_MANUFACTURER_ID
      ) {
        return product;
      }

      changed = true;
      return {
        ...product,
        dosage: {
          ...product.dosage,
          dosageType: 'standard',
          minAmount: 0.1,
          maxAmount: null,
          amount: 0.1,
          calculatorAmount: 0.1,
          unit: 'l',
          targetVolume: 10,
          volumeUnit: 'm³',
          frequency: 'custom_days',
          frequencyDays: 7,
        },
        updatedAt: now,
      };
    });

    if (changed) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    }

    localStorage.setItem(MIGRATION_KEY, 'true');
  } catch (err) {
    console.error('Greška pri migraciji BELIF Algicida:', err);
  }
}
