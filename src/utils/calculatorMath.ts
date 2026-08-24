import { ProductDosage, UserProduct } from '../types/product';
import { computeCalculatorAmount, formatFrequencyLabel } from './productStorage';

export interface CalculationResult {
  productTitle: string;
  calculatedAmount: number;
  formattedAmount: string;
  unit: string;
  dosageType: 'standard' | 'ph_correction' | 'chlorine_correction';
  subtitle: string;
  explanation: string;
  note?: string;
  poolM3: number;
  currentPh?: number | null;
  targetPh?: number | null;
  currentChlorine?: number | null;
  targetChlorine?: string;
  isOptimal?: boolean;
}

export interface WaterStatusIndicator {
  type: 'ph' | 'chlorine';
  value: number;
  formattedValue: string;
  status: 'below' | 'ideal' | 'above';
  statusText: string;
  idealText: string;
  isIdeal: boolean;
}

/**
 * Parses numeric inputs safely supporting both dot and comma (e.g. "7,8" or "7.8")
 */
export function parseLocalizedNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return isNaN(value) ? null : value;
  const normalized = value.toString().trim().replace(',', '.');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Formats a number with Bosnian/European decimal comma (e.g. 7.8 -> "7,8", 12.8 -> "12,8")
 */
export function formatLocalizedNumber(
  value: number | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined || isNaN(value)) return '';
  const rounded = Number(value.toFixed(decimals));
  return rounded.toString().replace('.', ',');
}

/**
 * Evaluates the water status indicator for pH or Chlorine
 */
export function evaluateWaterStatus(
  type: 'ph' | 'chlorine',
  value: number | null | undefined
): WaterStatusIndicator | null {
  if (value === null || value === undefined || isNaN(value) || value <= 0) {
    return null;
  }

  if (type === 'ph') {
    const formatted = formatLocalizedNumber(value, 2);
    if (value < 7.2) {
      return {
        type: 'ph', value, formattedValue: formatted, status: 'below',
        statusText: 'Ispod idealne vrijednosti', idealText: 'Idealno: 7,2 – 7,6', isIdeal: false,
      };
    } else if (value > 7.6) {
      return {
        type: 'ph', value, formattedValue: formatted, status: 'above',
        statusText: 'Iznad idealne vrijednosti', idealText: 'Idealno: 7,2 – 7,6', isIdeal: false,
      };
    } else {
      return {
        type: 'ph', value, formattedValue: formatted, status: 'ideal',
        statusText: 'U idealnom rasponu', idealText: 'Idealno: 7,2 – 7,6', isIdeal: true,
      };
    }
  }

  const formatted = formatLocalizedNumber(value, 2);
  if (value < 1.0) {
    return {
      type: 'chlorine', value, formattedValue: `${formatted} ppm`, status: 'below',
      statusText: 'Ispod idealne vrijednosti', idealText: 'Idealno: 1,0 – 3,0 ppm', isIdeal: false,
    };
  } else if (value > 3.0) {
    return {
      type: 'chlorine', value, formattedValue: `${formatted} ppm`, status: 'above',
      statusText: 'Iznad idealne vrijednosti', idealText: 'Idealno: 1,0 – 3,0 ppm', isIdeal: false,
    };
  } else {
    return {
      type: 'chlorine', value, formattedValue: `${formatted} ppm`, status: 'ideal',
      statusText: 'U idealnom rasponu', idealText: 'Idealno: 1,0 – 3,0 ppm', isIdeal: true,
    };
  }
}

/**
 * Format quantity nicely according to its unit.
 */
export function formatChemicalAmount(amount: number, unit: string): string {
  if (amount <= 0) return '0';

  if (unit === 'tableta' || unit === 'komad') {
    return `${Math.ceil(amount)}`;
  }

  if (unit === 'l' || unit === 'kg') {
    if (amount < 0.1) return formatLocalizedNumber(amount, 3);
    return formatLocalizedNumber(amount, 2);
  }

  if (amount >= 100) return `${Math.round(amount)}`;
  if (amount >= 10) {
    const rounded = Math.round(amount * 10) / 10;
    return formatLocalizedNumber(rounded, 1);
  }
  return formatLocalizedNumber(amount, 1);
}

/**
 * Kalkulatorski prikaz količine.
 * Važno: unos i deklaracija proizvoda ostaju u litrima, ali se tečne
 * potrebne količine u rezultatu kalkulatora prikazuju isključivo u ml.
 */
function formatCalculatorAmount(amount: number, sourceUnit: string): { formatted: string; displayUnit: string } {
  if (sourceUnit === 'l') {
    return {
      formatted: formatLocalizedNumber(amount * 1000, 1),
      displayUnit: 'ml',
    };
  }

  return {
    formatted: formatChemicalAmount(amount, sourceUnit),
    displayUnit: sourceUnit,
  };
}

/**
 * Main Chemistry Calculator Engine
 */
export function calculateChemicalDosage(params: {
  product: UserProduct;
  poolWorkingM3: number;
  currentPh?: number | null;
  currentChlorine?: number | null;
}): CalculationResult {
  const { product, poolWorkingM3, currentPh, currentChlorine } = params;
  const dosage = product.dosage;
  const unit = dosage.unit;
  const displayUnit = unit === 'l' ? 'ml' : unit;
  const targetVolumeM3 = dosage.targetVolume || 10;
  const productTitle = product.customTitle || product.categoryTitle;

  const baseCalcAmount =
    dosage.calculatorAmount ||
    computeCalculatorAmount(dosage.minAmount || dosage.amount, dosage.maxAmount, dosage.unit) ||
    dosage.amount ||
    100;

  const frequencyText = formatFrequencyLabel(dosage.frequency, dosage.frequencyDays);
  const dosageType = dosage.dosageType || (product.categoryId === 'ph_minus' || product.categoryId === 'ph_plus' ? 'ph_correction' : 'standard');

  if (dosageType === 'ph_correction') {
    const direction = dosage.phDirection || (product.categoryId === 'ph_plus' ? 'increase' : 'decrease');
    const phEffectAvg = dosage.phEffectAverage || dosage.phEffectMin || 0.10;

    if (direction === 'decrease') {
      const phVal = currentPh !== null && currentPh !== undefined ? currentPh : 7.8;
      const targetPh = 7.6;

      if (phVal <= targetPh) {
        return {
          productTitle, calculatedAmount: 0, formattedAmount: '0', unit: displayUnit,
          dosageType: 'ph_correction',
          subtitle: `pH vrijednost (${formatLocalizedNumber(phVal, 2)}) je u idealnom rasponu (7,2 – 7,6)`,
          explanation: 'Nije potrebno dodavati pH-. Vaš pH je optimalan.',
          note: 'Redovno provjeravajte pH vrijednost jednom do dva puta sedmično.',
          poolM3: poolWorkingM3, currentPh: phVal, targetPh, isOptimal: true,
        };
      }

      const deltaPh = phVal - targetPh;
      const volumeRatio = poolWorkingM3 / targetVolumeM3;
      const effectRatio = deltaPh / phEffectAvg;
      const rawRequired = volumeRatio * effectRatio * baseCalcAmount;
      const display = formatCalculatorAmount(rawRequired, unit);

      return {
        productTitle, calculatedAmount: rawRequired, formattedAmount: display.formatted, unit: display.displayUnit,
        dosageType: 'ph_correction',
        subtitle: `Za smanjenje pH sa ${formatLocalizedNumber(phVal, 2)} na ${formatLocalizedNumber(targetPh, 1)}`,
        explanation: `Prema deklarisanom doziranju: ${baseCalcAmount} ${unit} / ${targetVolumeM3} m³ za promjenu pH od ${formatLocalizedNumber(phEffectAvg, 2)}`,
        note: 'Nakon dodavanja sredstva ponovo izmjerite pH prije naredne korekcije.',
        poolM3: poolWorkingM3, currentPh: phVal, targetPh, isOptimal: false,
      };
    }

    if (direction === 'increase') {
      const phVal = currentPh !== null && currentPh !== undefined ? currentPh : 6.8;
      const targetPh = 7.2;

      if (phVal >= targetPh) {
        return {
          productTitle, calculatedAmount: 0, formattedAmount: '0', unit: displayUnit,
          dosageType: 'ph_correction',
          subtitle: `pH vrijednost (${formatLocalizedNumber(phVal, 2)}) je u idealnom rasponu (7,2 – 7,6)`,
          explanation: 'Nije potrebno dodavati pH+. Vaš pH je optimalan.',
          note: 'Redovno provjeravajte pH vrijednost jednom do dva puta sedmično.',
          poolM3: poolWorkingM3, currentPh: phVal, targetPh, isOptimal: true,
        };
      }

      const deltaPh = targetPh - phVal;
      const volumeRatio = poolWorkingM3 / targetVolumeM3;
      const effectRatio = deltaPh / phEffectAvg;
      const rawRequired = volumeRatio * effectRatio * baseCalcAmount;
      const display = formatCalculatorAmount(rawRequired, unit);

      return {
        productTitle, calculatedAmount: rawRequired, formattedAmount: display.formatted, unit: display.displayUnit,
        dosageType: 'ph_correction',
        subtitle: `Za povećanje pH sa ${formatLocalizedNumber(phVal, 2)} na ${formatLocalizedNumber(targetPh, 1)}`,
        explanation: `Prema deklarisanom doziranju: ${baseCalcAmount} ${unit} / ${targetVolumeM3} m³ za promjenu pH od ${formatLocalizedNumber(phEffectAvg, 2)}`,
        note: 'Nakon dodavanja sredstva ponovo izmjerite pH prije naredne korekcije.',
        poolM3: poolWorkingM3, currentPh: phVal, targetPh, isOptimal: false,
      };
    }
  }

  if (dosageType === 'chlorine_correction') {
    const clVal = currentChlorine !== null && currentChlorine !== undefined ? currentChlorine : null;
    const targetChlorine = '1,0 – 3,0 ppm';

    if (clVal !== null && clVal >= 1.0 && clVal <= 3.0) {
      return {
        productTitle, calculatedAmount: 0, formattedAmount: '0', unit: displayUnit,
        dosageType: 'chlorine_correction',
        subtitle: `Slobodni hlor (${formatLocalizedNumber(clVal, 2)} ppm) je u idealnom rasponu (1,0 – 3,0 ppm)`,
        explanation: 'Nije potrebna hitna korekcija. Održavajte nivo hlora standardnim doziranjem.',
        note: 'Provjeravajte nivo hlora redovno svakih nekoliko dana.',
        poolM3: poolWorkingM3, currentChlorine: clVal, targetChlorine, isOptimal: true,
      };
    }

    if (clVal !== null && clVal > 3.0) {
      return {
        productTitle, calculatedAmount: 0, formattedAmount: '0', unit: displayUnit,
        dosageType: 'chlorine_correction',
        subtitle: `Slobodni hlor (${formatLocalizedNumber(clVal, 2)} ppm) je iznad idealne vrijednosti`,
        explanation: 'Nemojte dodavati hlor. Pustite da nivo hlora prirodno opadne na suncu i kroz filtraciju.',
        note: 'Nemojte se kupati dok nivo hlora ne padne ispod 3,0 ppm.',
        poolM3: poolWorkingM3, currentChlorine: clVal, targetChlorine, isOptimal: false,
      };
    }

    const volumeRatio = poolWorkingM3 / targetVolumeM3;
    let rawRequired = volumeRatio * baseCalcAmount;

    if (clVal !== null && clVal >= 0 && clVal < 1.0) {
      const deficit = 1.5 - clVal;
      const multiplier = Math.max(0.5, Math.min(2.0, deficit / 1.0));
      rawRequired = volumeRatio * baseCalcAmount * multiplier;
    }

    const display = formatCalculatorAmount(rawRequired, unit);

    return {
      productTitle, calculatedAmount: rawRequired, formattedAmount: display.formatted, unit: display.displayUnit,
      dosageType: 'chlorine_correction',
      subtitle: clVal !== null ? `Trenutni hlor: ${formatLocalizedNumber(clVal, 2)} ppm • Ciljna vrijednost: ${targetChlorine}` : `Ciljna vrijednost: ${targetChlorine}`,
      explanation: `Prema deklarisanom doziranju: ${baseCalcAmount} ${unit} / ${targetVolumeM3} m³`,
      note: 'Nakon dodavanja hlora sačekajte nekoliko sati i ponovo izmjerite slobodni hlor.',
      poolM3: poolWorkingM3, currentChlorine: clVal, targetChlorine, isOptimal: false,
    };
  }

  const volumeRatio = poolWorkingM3 / targetVolumeM3;
  const rawRequired = volumeRatio * baseCalcAmount;
  const display = formatCalculatorAmount(rawRequired, unit);

  return {
    productTitle,
    calculatedAmount: rawRequired,
    formattedAmount: display.formatted,
    unit: display.displayUnit,
    dosageType: 'standard',
    subtitle: `Prema deklarisanom doziranju: ${baseCalcAmount} ${unit} / ${targetVolumeM3} m³`,
    explanation: `Za bazen zapremine ${formatLocalizedNumber(poolWorkingM3, 1)} m³ potrebno je ${display.formatted} ${display.displayUnit} (${frequencyText})`,
    note: dosage.frequency === 'weekly' ? 'Preporučuje se redovno sedmično doziranje.' : undefined,
    poolM3: poolWorkingM3,
    isOptimal: false,
  };
}
