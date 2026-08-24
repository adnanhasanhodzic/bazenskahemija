import {
  Manufacturer,
  UserProduct,
  ProductCategoryId,
  ProductDosage,
  DosageUnit,
  DosageFrequency,
  DosageType,
  PhCorrectionDirection,
  ProductTypeDefinition,
  ManufacturerGroup,
  CategoryGroup,
} from '../types/product';
import {
  DEFAULT_SEED_MANUFACTURER,
  DEFAULT_SEED_PRODUCTS,
} from './defaultSeedProducts';

export { DEFAULT_SEED_MANUFACTURER, DEFAULT_SEED_PRODUCTS };

const MANUFACTURERS_KEY = 'bazen_kalkulator_manufacturers_list';
const PRODUCTS_KEY = 'bazen_kalkulator_products_list';
const SEEDED_FLAG_KEY = 'bazen_kalkulator_db_seeded_v2';

/**
 * Automatski inicijalizuje ugrađenu početnu bazu (10 proizvoda proizvođača BELIF d.o.o.)
 * isključivo pri prvoj čistoj instalaciji aplikacije (kada je lokalna baza prazna/nepostojeća).
 *
 * Sprječava ponovno ubacivanje proizvoda pri svakom pokretanju aplikacije
 * i omogućava nesmetano uređivanje, dodavanje i brisanje proizvoda od strane korisnika.
 */
export function ensureProductsDatabaseInitialized(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const isSeeded = localStorage.getItem(SEEDED_FLAG_KEY);
    if (isSeeded === 'true') {
      // Već inicijalizovano ranije; ne diraj bazu čak i ako je korisnik namjerno obrisao sve stavke
      return;
    }

    const rawMfgs = localStorage.getItem(MANUFACTURERS_KEY);
    const rawProds = localStorage.getItem(PRODUCTS_KEY);

    // Ako u localStorage još uopšte ne postoji lista proizvođača i proizvoda (čista instalacija)
    if (rawMfgs === null && rawProds === null) {
      localStorage.setItem(MANUFACTURERS_KEY, JSON.stringify([DEFAULT_SEED_MANUFACTURER]));
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_SEED_PRODUCTS));
      localStorage.setItem(SEEDED_FLAG_KEY, 'true');
    } else {
      // Ako već postoje podaci od ranije u bazi, označi kao inicijalizovano da se ne prepisuju korisničke izmjene
      localStorage.setItem(SEEDED_FLAG_KEY, 'true');
    }
  } catch (err) {
    console.error('Greška pri inicijalizaciji početne baze proizvoda:', err);
  }
}

/* =========================================================================
 * GLOBALNI PRIORITET I REDOSLIJED SREDSTAVA — CIJELA APLIKACIJA
 * 1. pH-
 * 2. Algicid
 * 3. Flokulant
 * 4. Kristal
 * 5. Hlor tablete 20 g
 * 6. Hlor granule (i Šok hlor)
 * 7. Hlor tablete 200 g
 * 8. Multi tablete 20 g
 * 9. Multi tablete 200 g
 * 10. pH+
 * 11. Ostalo (uvijek na kraju)
 * ========================================================================= */

export const GLOBAL_PRODUCT_CATEGORY_ORDER: ProductCategoryId[] = [
  'ph_minus',
  'algaecide',
  'flocculant',
  'crystallizer',
  'chlorine_tablets_20g',
  'chlorine_granules',
  'chlorine_tablets_200g',
  'multi_tablets_20g',
  'multi_tablets_200g',
  'ph_plus',
  'other',
];

/**
 * Vraća numerički prioritet kategorije prema globalnom standardu aplikacije.
 */
export function getProductCategoryPriority(categoryId: ProductCategoryId | string): number {
  switch (categoryId) {
    case 'ph_minus':
      return 1;
    case 'algaecide':
      return 2;
    case 'flocculant':
      return 3;
    case 'crystallizer':
      return 4;
    case 'chlorine_tablets_20g':
      return 5;
    case 'chlorine_granules':
      return 6;
    case 'shock_chlorine':
      return 6.1; // Uz hlor granule
    case 'chlorine_tablets_200g':
      return 7;
    case 'multi_tablets_20g':
      return 8;
    case 'multi_tablets_200g':
      return 9;
    case 'ph_plus':
      return 10;
    case 'anti_scale':
      return 10.5;
    case 'active_oxygen':
      return 10.6;
    case 'other':
    default:
      return 999; // Ostalo je uvijek na posljednjem mjestu
  }
}

/**
 * Sortira bilo koju listu proizvoda ili stavki po globalnom redoslijedu kategorija (1..11),
 * a unutar iste kategorije sortira po proizvođaču ili nazivu.
 */
export function sortProductsByGlobalOrder<
  T extends { categoryId: ProductCategoryId | string; manufacturerName?: string; categoryTitle?: string; customTitle?: string }
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const pA = getProductCategoryPriority(a.categoryId);
    const pB = getProductCategoryPriority(b.categoryId);
    if (pA !== pB) {
      return pA - pB;
    }
    const mfgA = a.manufacturerName || '';
    const mfgB = b.manufacturerName || '';
    if (mfgA && mfgB && mfgA !== mfgB) {
      return mfgA.localeCompare(mfgB, 'bs');
    }
    const titleA = a.customTitle || a.categoryTitle || '';
    const titleB = b.customTitle || b.categoryTitle || '';
    return titleA.localeCompare(titleB, 'bs');
  });
}

/**
 * Predefined catalog of chemical products with distinct icons & default unit suggestions.
 * Standardni i fiksni redoslijed 1:1 sa globalnim prioritetom.
 */
export const PREDEFINED_PRODUCT_TYPES: ProductTypeDefinition[] = [
  {
    id: 'ph_minus',
    title: 'pH-',
    defaultUnit: 'l',
    defaultAmount: 0.1,
    defaultMinAmount: 0.1,
    defaultMaxAmount: undefined,
    defaultTargetVolume: 10,
    defaultFrequency: 'once',
    defaultDosageType: 'ph_correction',
    defaultPhDirection: 'decrease',
    defaultPhEffectMin: 0.10,
    defaultPhEffectMax: 0.15,
  },
  {
    id: 'algaecide',
    title: 'Algicid',
    defaultUnit: 'ml',
    defaultAmount: 75,
    defaultMinAmount: 50,
    defaultMaxAmount: 100,
    defaultTargetVolume: 10,
    defaultFrequency: 'custom_days',
    defaultFrequencyDays: 7,
    defaultDosageType: 'standard',
  },
  {
    id: 'flocculant',
    title: 'Flokulant',
    defaultUnit: 'ml',
    defaultAmount: 100,
    defaultMinAmount: 50,
    defaultMaxAmount: 100,
    defaultTargetVolume: 10,
    defaultFrequency: 'weekly',
    defaultDosageType: 'standard',
  },
  {
    id: 'crystallizer',
    title: 'Kristal',
    defaultUnit: 'ml',
    defaultAmount: 50,
    defaultMinAmount: 50,
    defaultMaxAmount: 100,
    defaultTargetVolume: 10,
    defaultFrequency: 'weekly',
    defaultDosageType: 'standard',
  },
  {
    id: 'chlorine_tablets_20g',
    title: 'Hlor tablete 20 g',
    defaultUnit: 'tableta',
    defaultAmount: 20,
    defaultMinAmount: 15,
    defaultMaxAmount: 20,
    defaultTargetVolume: 10,
    defaultFrequency: 'weekly',
    defaultDosageType: 'standard',
  },
  {
    id: 'chlorine_granules',
    title: 'Hlor granule',
    defaultUnit: 'g',
    defaultAmount: 100,
    defaultMinAmount: 100,
    defaultMaxAmount: undefined,
    defaultTargetVolume: 10,
    defaultFrequency: 'weekly',
    defaultDosageType: 'standard',
  },
  {
    id: 'chlorine_tablets_200g',
    title: 'Hlor tablete 200 g',
    defaultUnit: 'tableta',
    defaultAmount: 1,
    defaultMinAmount: 1,
    defaultMaxAmount: 2,
    defaultTargetVolume: 20,
    defaultFrequency: 'weekly',
    defaultDosageType: 'standard',
  },
  {
    id: 'multi_tablets_20g',
    title: 'Multi tablete 20 g',
    defaultUnit: 'tableta',
    defaultAmount: 20,
    defaultMinAmount: 15,
    defaultMaxAmount: 20,
    defaultTargetVolume: 10,
    defaultFrequency: 'weekly',
    defaultDosageType: 'standard',
  },
  {
    id: 'multi_tablets_200g',
    title: 'Multi tablete 200 g',
    defaultUnit: 'tableta',
    defaultAmount: 1,
    defaultMinAmount: 1,
    defaultMaxAmount: 2,
    defaultTargetVolume: 20,
    defaultFrequency: 'weekly',
    defaultDosageType: 'standard',
  },
  {
    id: 'ph_plus',
    title: 'pH+',
    defaultUnit: 'g',
    defaultAmount: 100,
    defaultMinAmount: 100,
    defaultMaxAmount: undefined,
    defaultTargetVolume: 10,
    defaultFrequency: 'once',
    defaultDosageType: 'ph_correction',
    defaultPhDirection: 'increase',
    defaultPhEffectMin: 0.10,
    defaultPhEffectMax: 0.15,
  },
  {
    id: 'other',
    title: 'Ostalo',
    defaultUnit: 'g',
    defaultAmount: 100,
    defaultMinAmount: 100,
    defaultMaxAmount: undefined,
    defaultTargetVolume: 10,
    defaultFrequency: 'weekly',
    defaultDosageType: 'standard',
  },
];

/* =========================================================================
 * DOSAGE CALCULATION MATH
 * ========================================================================= */

/**
 * Računa prosječni učinak na pH vrijednost.
 */
export function computePhEffectAverage(
  minEffect: number | null | undefined,
  maxEffect: number | null | undefined
): number | null {
  if (minEffect === null || minEffect === undefined || isNaN(minEffect) || minEffect <= 0) {
    if (maxEffect && !isNaN(maxEffect) && maxEffect > 0) return maxEffect;
    return null;
  }
  if (maxEffect === null || maxEffect === undefined || isNaN(maxEffect) || maxEffect <= 0 || maxEffect === minEffect) {
    return minEffect;
  }
  return Number(((minEffect + maxEffect) / 2).toFixed(3));
}

/**
 * Prikaz naziva tipa doziranja
 */
export function formatDosageTypeLabel(type: DosageType = 'standard'): string {
  switch (type) {
    case 'ph_correction':
      return 'Korekcija pH';
    case 'chlorine_correction':
      return 'Korekcija hlora';
    case 'standard':
    default:
      return 'Standardno doziranje';
  }
}

/**
 * Prikaz smjera korekcije pH
 */
export function formatPhDirectionLabel(direction: PhCorrectionDirection = 'decrease'): string {
  switch (direction) {
    case 'increase':
      return 'Povećava pH (pH+)';
    case 'decrease':
    default:
      return 'Snižava pH (pH-)';
  }
}

/**
 * Automatski izračunava kalkulatorsku vrijednost na osnovu minimalne i maksimalne doze.
 * - Ako je unesen raspon (min i max): računa se (min + max) / 2
 * - Za tablete / komade: zaokružuje se na cijeli broj prema gore (npr. 1–2 tablete -> 1.5 -> 2 tablete)
 * - Za tečne ('ml', 'l') i granulirane ('g', 'kg'): koristi se stvarna sredina raspona (npr. 50–100 ml -> 75 ml)
 * - Ako je unijeta samo fiksna doza (max je prazan ili 0): koristi se ta fiksna vrijednost
 */
export function computeCalculatorAmount(
  minAmount: number,
  maxAmount: number | null | undefined,
  unit: DosageUnit
): number {
  if (!minAmount || minAmount <= 0) {
    if (maxAmount && maxAmount > 0) return maxAmount;
    return 0;
  }

  if (!maxAmount || maxAmount <= 0 || maxAmount === minAmount) {
    return minAmount;
  }

  const rawAverage = (minAmount + maxAmount) / 2;

  if (unit === 'tableta' || unit === 'komad') {
    // Kod tableta zaokružiti na praktičnu cijelu tabletu (npr. 1-2 tablete -> 1.5 -> 2 tablete)
    return Math.ceil(rawAverage);
  }

  // Za tečne i granulirane proizvode: stvarna sredina
  return Number(rawAverage.toFixed(2));
}

/**
 * Format human-readable frequency string
 */
export function formatFrequencyLabel(
  frequency: DosageFrequency = 'weekly',
  frequencyDays?: number
): string {
  switch (frequency) {
    case 'once':
      return 'Jednokratno';
    case 'daily':
      return 'Dnevno';
    case 'weekly':
      return 'Sedmično';
    case 'custom_days':
      return `Svakih ${frequencyDays || 7} dana`;
    case 'monthly':
      return 'Mjesečno';
    default:
      return 'Sedmično';
  }
}

/**
 * Calculates required dose for a given pool volume in liters.
 * Standard dosage formula:
 * (poolLiters / targetLiters) * calculatorAmount
 * E.g., 50–100 ml (kalkulator 75 ml) na 10 m³ (10,000 L) za bazen od 12,000 L = 90 ml
 */
export function calculateRequiredDose(
  dosage: ProductDosage,
  poolWorkingLiters: number
): {
  calculatedAmount: number;
  formattedAmount: string;
  unit: string;
  frequencyText: string;
  explanation: string;
} {
  const calcAmount =
    dosage.calculatorAmount ||
    computeCalculatorAmount(dosage.minAmount || dosage.amount, dosage.maxAmount, dosage.unit) ||
    dosage.amount ||
    0;

  const freqText = formatFrequencyLabel(dosage.frequency, dosage.frequencyDays);

  if (!poolWorkingLiters || poolWorkingLiters <= 0) {
    return {
      calculatedAmount: calcAmount,
      formattedAmount: `${calcAmount}`,
      unit: dosage.unit,
      frequencyText: freqText,
      explanation: `${calcAmount} ${dosage.unit} / ${dosage.targetVolume} ${dosage.volumeUnit}`,
    };
  }

  // Convert target volume to liters (1 m³ = 1,000 L)
  const targetLiters = (dosage.targetVolume || 10) * 1000;
  if (targetLiters <= 0) {
    return {
      calculatedAmount: 0,
      formattedAmount: '0',
      unit: dosage.unit,
      frequencyText: freqText,
      explanation: 'Nevažeća zapremina za doziranje',
    };
  }

  const ratio = poolWorkingLiters / targetLiters;
  const rawCalculated = calcAmount * ratio;

  // Formatting based on unit
  let formatted = '';
  if (dosage.unit === 'tableta' || dosage.unit === 'komad') {
    // Za tablete u bazenu: zaokruži na praktičan cijeli broj ili .5
    const rounded = Math.ceil(rawCalculated);
    formatted = `${rounded}`;
  } else if (dosage.unit === 'kg' || dosage.unit === 'l') {
    formatted = rawCalculated < 1 ? rawCalculated.toFixed(2) : rawCalculated.toFixed(1);
  } else {
    // grams or ml
    formatted =
      rawCalculated >= 100
        ? `${Math.round(rawCalculated)}`
        : rawCalculated.toFixed(1).replace('.0', '');
  }

  const poolM3 = (poolWorkingLiters / 1000).toFixed(1).replace('.0', '');

  return {
    calculatedAmount: rawCalculated,
    formattedAmount: formatted,
    unit: dosage.unit,
    frequencyText: freqText,
    explanation: `Za vaš bazen (${poolWorkingLiters.toLocaleString('de-DE')} L / ${poolM3} m³) potrebno je ${formatted} ${dosage.unit} (${freqText})`,
  };
}

/* =========================================================================
 * MANUFACTURERS STORAGE
 * ========================================================================= */

/**
 * Retrieves all saved manufacturers from localStorage.
 * Automatically seeds the 10 BELIF d.o.o. default products on fresh install.
 */
export function getSavedManufacturers(): Manufacturer[] {
  ensureProductsDatabaseInitialized();
  try {
    const raw = localStorage.getItem(MANUFACTURERS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Manufacturer[];
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Greška pri čitanju proizvođača:', err);
    return [];
  }
}

/**
 * Adds a new manufacturer if not already present.
 */
export function saveManufacturer(name: string): {
  success: boolean;
  manufacturer: Manufacturer;
  manufacturers: Manufacturer[];
} {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Naziv proizvođača ne može biti prazan.');
  }

  const current = getSavedManufacturers();
  const existing = current.find((m) => m.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) {
    return { success: true, manufacturer: existing, manufacturers: current };
  }

  const newMfg: Manufacturer = {
    id: `mfg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: trimmed,
    createdAt: new Date().toISOString(),
  };

  const updated = [...current, newMfg].sort((a, b) => a.name.localeCompare(b.name));
  localStorage.setItem(MANUFACTURERS_KEY, JSON.stringify(updated));

  return { success: true, manufacturer: newMfg, manufacturers: updated };
}

/**
 * Deletes a manufacturer and ALL products belonging to that manufacturer.
 */
export function deleteManufacturerAndProducts(manufacturerId: string): {
  manufacturers: Manufacturer[];
  products: UserProduct[];
} {
  const currentMfgs = getSavedManufacturers();
  const updatedMfgs = currentMfgs.filter((m) => m.id !== manufacturerId);
  localStorage.setItem(MANUFACTURERS_KEY, JSON.stringify(updatedMfgs));

  const currentProds = getSavedUserProducts();
  const updatedProds = currentProds.filter((p) => p.manufacturerId !== manufacturerId);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProds));

  return { manufacturers: updatedMfgs, products: updatedProds };
}

/* =========================================================================
 * USER PRODUCTS STORAGE
 * ========================================================================= */

/**
 * Normalizes a stored product to ensure it supports the new dosage range & frequency model.
 */
function normalizeProduct(p: any): UserProduct {
  const dosageRaw = p.dosage || {};
  const minAmt = dosageRaw.minAmount ?? dosageRaw.amount ?? (p.categoryId === 'ph_minus' ? 0.1 : 100);
  const maxAmt = dosageRaw.maxAmount !== undefined ? dosageRaw.maxAmount : undefined;
  const unit = dosageRaw.unit || (p.categoryId === 'ph_minus' ? 'l' : 'g');
  const calcAmt =
    dosageRaw.calculatorAmount ??
    computeCalculatorAmount(minAmt, maxAmt, unit) ??
    dosageRaw.amount ??
    minAmt;

  // Dosage type & pH fields
  let dosageType: DosageType = dosageRaw.dosageType;
  if (!dosageType) {
    if (p.categoryId === 'ph_minus' || p.categoryId === 'ph_plus') {
      dosageType = 'ph_correction';
    } else {
      dosageType = 'standard';
    }
  }

  const phDirection: PhCorrectionDirection | undefined =
    dosageRaw.phDirection || (p.categoryId === 'ph_plus' ? 'increase' : p.categoryId === 'ph_minus' ? 'decrease' : undefined);

  const phEffectMin = dosageRaw.phEffectMin !== undefined ? dosageRaw.phEffectMin : (dosageType === 'ph_correction' ? 0.10 : undefined);
  const phEffectMax = dosageRaw.phEffectMax !== undefined ? dosageRaw.phEffectMax : (dosageType === 'ph_correction' && p.categoryId === 'ph_minus' ? 0.15 : undefined);
  const phEffectAvg = dosageRaw.phEffectAverage !== undefined ? dosageRaw.phEffectAverage : computePhEffectAverage(phEffectMin, phEffectMax);

  const normalizedDosage: ProductDosage = {
    dosageType,
    minAmount: minAmt,
    maxAmount: maxAmt,
    amount: calcAmt,
    calculatorAmount: calcAmt,
    unit: unit,
    targetVolume: dosageRaw.targetVolume || 10,
    volumeUnit: 'm³',
    frequency: dosageRaw.frequency || (dosageType === 'ph_correction' ? 'once' : 'weekly'),
    frequencyDays: dosageRaw.frequencyDays ?? 7,
    phDirection,
    phEffectMin,
    phEffectMax,
    phEffectAverage: phEffectAvg,
  };

  return {
    ...p,
    dosage: normalizedDosage,
  };
}

/**
 * Retrieves all user products from localStorage, strictly sorted by global category priority (1..11).
 * Automatically seeds the 10 BELIF d.o.o. default products on fresh install.
 */
export function getSavedUserProducts(): UserProduct[] {
  ensureProductsDatabaseInitialized();
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as UserProduct[];
    if (!Array.isArray(list)) return [];
    const normalized = list.map(normalizeProduct);
    return sortProductsByGlobalOrder(normalized);
  } catch (err) {
    console.error('Greška pri čitanju proizvoda:', err);
    return [];
  }
}

/**
 * Saves or updates a manufacturer along with all its selected products.
 * PROIZVOĐAČ -> ODABIR PROIZVODA -> DOZIRANJE (sa rasponom, učestalošću i automatskom kalkulatorskom vrijednošću) -> SPREMI
 */
export function saveManufacturerWithProducts(params: {
  manufacturerName: string;
  existingManufacturerId?: string | null;
  productsData: Array<{
    id?: string;
    categoryId: ProductCategoryId;
    customTitle?: string;
    dosage: ProductDosage;
  }>;
}): {
  manufacturer: Manufacturer;
  manufacturers: Manufacturer[];
  products: UserProduct[];
} {
  const trimmedName = params.manufacturerName.trim();
  if (!trimmedName) {
    throw new Error('Naziv proizvođača je obavezan.');
  }

  if (!params.productsData || params.productsData.length === 0) {
    throw new Error('Morate odabrati najmanje jedan proizvod i unijeti njegovo doziranje.');
  }

  // 1. Resolve or create Manufacturer
  const allMfgs = getSavedManufacturers();
  let mfg: Manufacturer;

  if (params.existingManufacturerId) {
    const found = allMfgs.find((m) => m.id === params.existingManufacturerId);
    if (found) {
      found.name = trimmedName;
      mfg = found;
    } else {
      mfg = {
        id: params.existingManufacturerId,
        name: trimmedName,
        createdAt: new Date().toISOString(),
      };
      allMfgs.push(mfg);
    }
  } else {
    const existingByName = allMfgs.find((m) => m.name.toLowerCase() === trimmedName.toLowerCase());
    if (existingByName) {
      mfg = existingByName;
    } else {
      mfg = {
        id: `mfg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: trimmedName,
        createdAt: new Date().toISOString(),
      };
      allMfgs.push(mfg);
    }
  }

  // Persist updated manufacturers
  allMfgs.sort((a, b) => a.name.localeCompare(b.name));
  localStorage.setItem(MANUFACTURERS_KEY, JSON.stringify(allMfgs));

  // 2. Resolve Products
  const allProds = getSavedUserProducts();
  // Remove existing products for this manufacturer to cleanly overwrite with user's selected list
  const otherProds = allProds.filter((p) => p.manufacturerId !== mfg.id);

  const now = new Date().toISOString();
  const newProdsForMfg: UserProduct[] = params.productsData.map((item, idx) => {
    const def = PREDEFINED_PRODUCT_TYPES.find((t) => t.id === item.categoryId);
    const categoryTitle = def ? def.title : item.categoryId;

    const calcAmount = computeCalculatorAmount(
      item.dosage.minAmount,
      item.dosage.maxAmount,
      item.dosage.unit
    );

    const dosageType: DosageType = item.dosage.dosageType || 'standard';
    const phDirection = item.dosage.phDirection;
    const phEffectMin = item.dosage.phEffectMin ?? null;
    const phEffectMax = item.dosage.phEffectMax ?? null;
    const phEffectAverage = computePhEffectAverage(phEffectMin, phEffectMax);

    const completeDosage: ProductDosage = {
      dosageType,
      minAmount: item.dosage.minAmount,
      maxAmount: item.dosage.maxAmount ?? null,
      amount: calcAmount,
      calculatorAmount: calcAmount,
      unit: item.dosage.unit,
      targetVolume: item.dosage.targetVolume || 10,
      volumeUnit: 'm³',
      frequency: item.dosage.frequency || (dosageType === 'ph_correction' ? 'once' : 'weekly'),
      frequencyDays: item.dosage.frequency === 'custom_days' ? (item.dosage.frequencyDays || 7) : undefined,
      phDirection: dosageType === 'ph_correction' ? phDirection : undefined,
      phEffectMin: dosageType === 'ph_correction' ? phEffectMin : undefined,
      phEffectMax: dosageType === 'ph_correction' ? phEffectMax : undefined,
      phEffectAverage: dosageType === 'ph_correction' ? phEffectAverage : undefined,
    };

    return {
      id: item.id || `prod_${mfg.id}_${item.categoryId}_${Date.now()}_${idx}`,
      manufacturerId: mfg.id,
      manufacturerName: mfg.name,
      categoryId: item.categoryId,
      categoryTitle,
      customTitle: item.categoryId === 'other' ? item.customTitle?.trim() : undefined,
      dosage: completeDosage,
      createdAt: now,
      updatedAt: now,
    };
  });

  const updatedAllProds = [...otherProds, ...newProdsForMfg];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedAllProds));

  return {
    manufacturer: mfg,
    manufacturers: allMfgs,
    products: updatedAllProds,
  };
}

/**
 * Deletes a single user product by ID.
 */
export function deleteUserProduct(id: string): UserProduct[] {
  const current = getSavedUserProducts();
  const filtered = current.filter((p) => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  return filtered;
}

/**
 * Returns products grouped by manufacturer for the "Moji proizvodi" screen,
 * with products inside each manufacturer strictly ordered by global priority (1..11).
 */
export function getGroupedManufacturers(): ManufacturerGroup[] {
  const mfgs = getSavedManufacturers();
  const prods = getSavedUserProducts();

  const groups: ManufacturerGroup[] = [];

  // 1. Group by known manufacturers
  for (const mfg of mfgs) {
    const mfgProds = prods.filter((p) => p.manufacturerId === mfg.id);
    groups.push({
      manufacturer: mfg,
      products: sortProductsByGlobalOrder(mfgProds),
    });
  }

  // 2. Catch any orphan products (if manufacturer was not in mfgs list)
  const knownMfgIds = new Set(mfgs.map((m) => m.id));
  const orphanProds = prods.filter((p) => !knownMfgIds.has(p.manufacturerId));
  if (orphanProds.length > 0) {
    const orphanGroupsMap = new Map<string, UserProduct[]>();
    for (const op of orphanProds) {
      const name = op.manufacturerName || 'Ostali proizvođači';
      if (!orphanGroupsMap.has(name)) {
        orphanGroupsMap.set(name, []);
      }
      orphanGroupsMap.get(name)!.push(op);
    }

    for (const [name, pList] of orphanGroupsMap.entries()) {
      groups.push({
        manufacturer: {
          id: pList[0].manufacturerId || `mfg_orphan_${name}`,
          name,
          createdAt: pList[0].createdAt,
        },
        products: sortProductsByGlobalOrder(pList),
      });
    }
  }

  return groups;
}

/**
 * Returns all added products grouped by category in strict GLOBAL PRIORITY ORDER (1..11).
 * If a category has no products added, it is NOT returned (no empty cards).
 * Within each category, products are sorted by manufacturer name.
 */
export function getGroupedByCategoryProducts(): CategoryGroup[] {
  const prods = getSavedUserProducts();
  if (prods.length === 0) return [];

  const groupsMap = new Map<ProductCategoryId | string, UserProduct[]>();
  for (const prod of prods) {
    if (!groupsMap.has(prod.categoryId)) {
      groupsMap.set(prod.categoryId, []);
    }
    groupsMap.get(prod.categoryId)!.push(prod);
  }

  // Sort categories strictly by GLOBAL category priority (1..11)
  const sortedCategories = Array.from(groupsMap.keys()).sort((a, b) => {
    return getProductCategoryPriority(a) - getProductCategoryPriority(b);
  });

  const result: CategoryGroup[] = [];
  for (const catId of sortedCategories) {
    const catProds = groupsMap.get(catId)!;
    // Sort products of same category by manufacturer name
    const sortedProds = [...catProds].sort((a, b) => {
      const mA = a.manufacturerName || '';
      const mB = b.manufacturerName || '';
      return mA.localeCompare(mB, 'bs');
    });

    const def = PREDEFINED_PRODUCT_TYPES.find((t) => t.id === catId);
    const categoryTitle = def ? def.title : sortedProds[0]?.categoryTitle || (catId as string);

    result.push({
      categoryId: catId as ProductCategoryId,
      categoryTitle,
      products: sortedProds,
    });
  }

  return result;
}
