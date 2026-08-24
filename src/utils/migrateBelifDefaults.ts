import { UserProduct } from '../types/product';

const PRODUCTS_KEY = 'bazen_kalkulator_products_list';
const MIGRATION_KEY = 'bazen_kalkulator_belif_chlorine_20g_v5';
const BELIF_MANUFACTURER_ID = 'mfg_belif_doo';
const CHLORINE_20G_ID = 'prod_belif_chlorine_tablets_20g';

/**
 * Jednokratna migracija postojeće lokalne baze.
 * Ispravlja ISKLJUČIVO BELIF Hlor tablete 20 g na 1 tabletu / 3 m³.
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
        product.id !== CHLORINE_20G_ID ||
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
          minAmount: 1,
          maxAmount: null,
          amount: 1,
          calculatorAmount: 1,
          unit: 'tableta',
          targetVolume: 3,
          volumeUnit: 'm³',
          frequency: 'weekly',
        },
        updatedAt: now,
      };
    });

    if (changed) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    }

    localStorage.setItem(MIGRATION_KEY, 'true');
  } catch (err) {
    console.error('Greška pri migraciji BELIF Hlor tablete 20 g:', err);
  }
}
