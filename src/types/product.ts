/**
 * Product, Manufacturer & Dosage Domain Models
 */

export type ProductCategoryId =
  | 'ph_minus'
  | 'ph_plus'
  | 'chlorine_tablets_20g'
  | 'chlorine_tablets_200g'
  | 'multi_tablets_20g'
  | 'multi_tablets_200g'
  | 'chlorine_granules'
  | 'shock_chlorine'
  | 'flocculant'
  | 'algaecide'
  | 'crystallizer'
  | 'anti_scale'
  | 'active_oxygen'
  | 'other';

export type DosageUnit = 'g' | 'kg' | 'ml' | 'l' | 'tableta' | 'komad';
export type VolumeUnit = 'm³';

export type DosageType = 'standard' | 'ph_correction' | 'chlorine_correction';
export type PhCorrectionDirection = 'decrease' | 'increase'; // 'decrease' = Snižava pH (pH-), 'increase' = Povećava pH (pH+)

export type DosageFrequency =
  | 'once' // Jednokratno / Po potrebi
  | 'daily' // Dnevno
  | 'weekly' // Sedmično
  | 'custom_days' // Svakih X dana
  | 'monthly'; // Mjesečno

export interface ProductDosage {
  dosageType?: DosageType; // 'standard' | 'ph_correction' | 'chlorine_correction'
  minAmount: number; // Minimalna doza (ili fiksna doza ako nema raspona), npr. 50
  maxAmount?: number | null; // Maksimalna doza (opcionalno, npr. 100)
  amount: number; // Kompatibilnost: jednaka calculatorAmount
  calculatorAmount: number; // Automatski izračunata srednja vrijednost za kalkulator (npr. 75 ml, ili zaokruženo za tablete)
  unit: DosageUnit; // e.g. 'g', 'tableta', 'ml', 'l'
  targetVolume: number; // Referentna zapremina, e.g. 10
  volumeUnit: VolumeUnit; // e.g. 'm³'
  frequency: DosageFrequency; // 'once' | 'daily' | 'weekly' | 'custom_days' | 'monthly'
  frequencyDays?: number; // Broj dana ako je frequency === 'custom_days' (npr. 7)

  // Polja specifična za pH korekciju (kada je dosageType === 'ph_correction')
  phDirection?: PhCorrectionDirection; // 'decrease' (Snižava pH) | 'increase' (Povećava pH)
  phEffectMin?: number | null; // npr. 0.10
  phEffectMax?: number | null; // npr. 0.15 (opcionalno, ako je raspon)
  phEffectAverage?: number | null; // Srednji učinak na pH (npr. 0.125)
}

export interface Manufacturer {
  id: string;
  name: string; // e.g. "BELID d.o.o."
  createdAt: string;
}

export interface ProductTypeDefinition {
  id: ProductCategoryId;
  title: string;
  defaultUnit: DosageUnit;
  defaultAmount: number;
  defaultMinAmount?: number;
  defaultMaxAmount?: number;
  defaultTargetVolume: number;
  defaultFrequency?: DosageFrequency;
  defaultFrequencyDays?: number;
  defaultDosageType?: DosageType;
  defaultPhDirection?: PhCorrectionDirection;
  defaultPhEffectMin?: number;
  defaultPhEffectMax?: number;
}

export interface UserProduct {
  id: string;
  manufacturerId: string; // references Manufacturer.id
  manufacturerName: string; // e.g. "BELID d.o.o."
  categoryId: ProductCategoryId; // e.g. "chlorine_tablets_200g"
  categoryTitle: string; // e.g. "Hlor tablete 200 g"
  customTitle?: string; // if category is 'other' or custom note
  dosage: ProductDosage; // Primary recommended dosage with range & calculated value
  createdAt: string;
  updatedAt: string;
}

export interface ManufacturerGroup {
  manufacturer: Manufacturer;
  products: UserProduct[];
}

export interface CategoryGroup {
  categoryId: ProductCategoryId;
  categoryTitle: string;
  products: UserProduct[];
}
