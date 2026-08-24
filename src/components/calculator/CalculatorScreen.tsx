import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Droplets,
  FlaskConical,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  Clock,
  ArrowRight,
  Info,
  Calendar,
  Check,
  Package,
  Waves,
} from 'lucide-react';
import { Pool } from '../../types/pool';
import { UserProduct } from '../../types/product';
import { WaterTestRecord } from '../../types/waterTest';
import { getSavedPools } from '../../utils/poolStorage';
import {
  getSavedUserProducts,
  sortProductsByGlobalOrder,
  formatFrequencyLabel,
} from '../../utils/productStorage';
import {
  getLatestWaterTest,
  formatDisplayDate,
  isTestOutdated,
  evaluatePhValue,
  evaluateChlorineValue,
} from '../../utils/waterTestStorage';
import {
  calculateChemicalDosage,
  formatLocalizedNumber,
  CalculationResult,
} from '../../utils/calculatorMath';
import { ProductIcon } from '../products/ProductIcons';

interface CalculatorScreenProps {
  activePool: Pool | null;
  allPools?: Pool[];
  onBack?: () => void;
  onNavigateToWaterTest?: () => void;
  onNavigateToProducts?: () => void;
  onSelectActivePoolId?: (poolId: string) => void;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({
  activePool,
  allPools = [],
  onBack,
  onNavigateToWaterTest,
  onNavigateToProducts,
}) => {
  // 1. POOL (Automatski preuzet aktivni bazen iz "Test vode" ili "Moj bazen")
  const currentPool: Pool | null = useMemo(() => {
    if (activePool) return activePool;
    if (allPools.length > 0) return allPools[0];
    const saved = getSavedPools();
    return saved.length > 0 ? saved[0] : null;
  }, [activePool, allPools]);

  const poolVolumeM3: number = useMemo(() => {
    if (!currentPool) return 10.0;
    return currentPool.workingVolumeLiters / 1000;
  }, [currentPool]);

  // 2. PRODUCTS FROM STORAGE
  const [userProducts, setUserProducts] = useState<UserProduct[]>(() => getSavedUserProducts());

  useEffect(() => {
    setUserProducts(getSavedUserProducts());
  }, []);

  // 3. LATEST WATER TEST FOR CURRENT POOL
  const [latestTest, setLatestTest] = useState<WaterTestRecord | null>(() => {
    return currentPool ? getLatestWaterTest(currentPool.id) : null;
  });

  useEffect(() => {
    if (currentPool) {
      setLatestTest(getLatestWaterTest(currentPool.id));
    } else {
      setLatestTest(null);
    }
  }, [currentPool]);

  // Evaluations for the latest test
  const phEval = useMemo(() => {
    if (!latestTest) return null;
    return evaluatePhValue(latestTest.ph);
  }, [latestTest]);

  const chlorineEval = useMemo(() => {
    if (!latestTest) return null;
    return evaluateChlorineValue(latestTest.chlorine);
  }, [latestTest]);

  const testIsOutdated = useMemo(() => {
    if (!latestTest) return false;
    return isTestOutdated(latestTest.date);
  }, [latestTest]);

  // 4. FIND MATCHING PRODUCTS FROM "MOJI PROIZVODI"

  // pH- products
  const phMinusProducts = useMemo(() => {
    return userProducts.filter(
      (p) =>
        p.categoryId === 'ph_minus' ||
        (p.dosage.dosageType === 'ph_correction' && p.dosage.phDirection === 'decrease')
    );
  }, [userProducts]);

  // pH+ products
  const phPlusProducts = useMemo(() => {
    return userProducts.filter(
      (p) =>
        p.categoryId === 'ph_plus' ||
        (p.dosage.dosageType === 'ph_correction' && p.dosage.phDirection === 'increase')
    );
  }, [userProducts]);

  // Chlorine correction products (granules, shock, tablets 20g, or chlorine_correction type)
  const chlorineProducts = useMemo(() => {
    return userProducts.filter(
      (p) =>
        p.categoryId === 'chlorine_granules' ||
        p.categoryId === 'shock_chlorine' ||
        p.categoryId === 'chlorine_tablets_20g' ||
        p.categoryId === 'chlorine_tablets_200g' ||
        p.dosage.dosageType === 'chlorine_correction'
    );
  }, [userProducts]);

  // Regular Maintenance products (Algicide, Flocculant, Clarifier, Long-term tablets, etc.)
  const maintenanceProducts = useMemo(() => {
    const raw = userProducts.filter(
      (p) =>
        p.categoryId !== 'ph_minus' &&
        p.categoryId !== 'ph_plus' &&
        p.dosage.dosageType !== 'ph_correction'
    );
    return sortProductsByGlobalOrder(raw);
  }, [userProducts]);

  // Product selection states if user has multiple products in a category
  const [selectedPhMinusId, setSelectedPhMinusId] = useState<string>('');
  const [selectedPhPlusId, setSelectedPhPlusId] = useState<string>('');
  const [selectedChlorineId, setSelectedChlorineId] = useState<string>('');

  // Selected Maintenance product for Section 2
  const [selectedMaintProductId, setSelectedMaintProductId] = useState<string>('');

  // Default selection when products load
  useEffect(() => {
    if (phMinusProducts.length > 0 && !selectedPhMinusId) {
      setSelectedPhMinusId(phMinusProducts[0].id);
    }
    if (phPlusProducts.length > 0 && !selectedPhPlusId) {
      setSelectedPhPlusId(phPlusProducts[0].id);
    }
    if (chlorineProducts.length > 0 && !selectedChlorineId) {
      setSelectedChlorineId(chlorineProducts[0].id);
    }
    if (maintenanceProducts.length > 0 && !selectedMaintProductId) {
      setSelectedMaintProductId(maintenanceProducts[0].id);
    }
  }, [phMinusProducts, phPlusProducts, chlorineProducts, maintenanceProducts]);

  // 5. AUTOMATIC CALCULATIONS FOR SECTION 1: KOREKCIJA VODE

  // pH Calculation
  const phCorrectionCalculation: CalculationResult | null = useMemo(() => {
    if (!latestTest || !currentPool) return null;
    const phVal = latestTest.ph;

    // If pH is too high (> 7.6) -> Recommend pH-
    if (phVal > 7.6) {
      const product = phMinusProducts.find((p) => p.id === selectedPhMinusId) || phMinusProducts[0];
      if (!product) return null;
      return calculateChemicalDosage({
        product,
        poolWorkingM3: poolVolumeM3,
        currentPh: phVal,
      });
    }

    // If pH is too low (< 7.2) -> Recommend pH+
    if (phVal < 7.2) {
      const product = phPlusProducts.find((p) => p.id === selectedPhPlusId) || phPlusProducts[0];
      if (!product) return null;
      return calculateChemicalDosage({
        product,
        poolWorkingM3: poolVolumeM3,
        currentPh: phVal,
      });
    }

    return null; // Ideal range, no correction needed
  }, [latestTest, currentPool, poolVolumeM3, phMinusProducts, phPlusProducts, selectedPhMinusId, selectedPhPlusId]);

  // Chlorine Calculation
  const chlorineCorrectionCalculation: CalculationResult | null = useMemo(() => {
    if (!latestTest || !currentPool) return null;
    const clVal = latestTest.chlorine;

    // If Chlorine is too low (< 1.0) -> Recommend Chlorination
    if (clVal < 1.0) {
      const product = chlorineProducts.find((p) => p.id === selectedChlorineId) || chlorineProducts[0];
      if (!product) return null;
      return calculateChemicalDosage({
        product,
        poolWorkingM3: poolVolumeM3,
        currentChlorine: clVal,
      });
    }

    return null; // Ideal (1.0-3.0) or High (>3.0) -> No additional chlorination recommended
  }, [latestTest, currentPool, poolVolumeM3, chlorineProducts, selectedChlorineId]);

  // 6. CALCULATION FOR SECTION 2: REDOVNO ODRŽAVANJE
  const selectedMaintProduct = useMemo(() => {
    if (!selectedMaintProductId) return null;
    return maintenanceProducts.find((p) => p.id === selectedMaintProductId) || null;
  }, [selectedMaintProductId, maintenanceProducts]);

  const maintenanceCalculation: CalculationResult | null = useMemo(() => {
    if (!selectedMaintProduct || !currentPool) return null;
    return calculateChemicalDosage({
      product: selectedMaintProduct,
      poolWorkingM3: poolVolumeM3,
    });
  }, [selectedMaintProduct, currentPool, poolVolumeM3]);

  return (
    <div className="w-full flex flex-col bg-[#F8FAFC] min-h-full pb-24 select-none">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              id="btn-back-from-calculator"
              type="button"
              onClick={onBack}
              className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none cursor-pointer"
              aria-label="Nazad"
            >
              <ArrowLeft size={20} strokeWidth={2.3} />
            </button>
          )}
          <h1 className="text-base font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <FlaskConical size={19} className="text-[#0062E3]" />
            <span>Kalkulator hemije</span>
          </h1>
        </div>

        {currentPool && (
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-[#0062E3] border border-blue-100">
            {formatLocalizedNumber(poolVolumeM3, 1)} m³
          </span>
        )}
      </header>

      {/* Main Content Area */}
      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto w-full">
        {/* =========================================================================
            INFORMATIVNI PRIKAZ TRENUTNO KORIŠTENOG BAZENA (Bez dropdowna)
            ========================================================================= */}
        {currentPool ? (
          <div
            id="card-calculator-pool-info"
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0062E3] flex items-center justify-center flex-shrink-0 border border-blue-100">
                <Waves size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-base font-black text-[#0F172A] tracking-tight">
                  {currentPool.name || 'Moj bazen'}
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Radna zapremina:{' '}
                  <strong className="text-slate-800 font-black">
                    {formatLocalizedNumber(poolVolumeM3, 2)} m³
                  </strong>{' '}
                  <span className="text-slate-400 font-normal text-[11px]">
                    ({currentPool.workingVolumeLiters.toLocaleString('de-DE')} L)
                  </span>
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-blue-50 text-[#0062E3] text-[10px] font-extrabold rounded-full border border-blue-100 uppercase tracking-wide">
              Aktivni bazen
            </span>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 rounded-3xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <AlertTriangle size={16} />
              <span>Nemate spremljen bazen</span>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              Molimo dodajte svoj bazen sa dimenzijama kako bi kalkulator automatski računao tačne doze.
            </p>
          </div>
        )}

        {/* =========================================================================
            STANJE VODE (Automatski iz posljednjeg testa)
            ========================================================================= */}
        <section
          id="section-current-water-state"
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3.5"
          aria-labelledby="heading-water-state"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <h2 id="heading-water-state" className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                STANJE VODE
              </h2>
            </div>

            {latestTest && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <Calendar size={13} className="text-slate-400" />
                <span>Posljednji test: <strong className="text-slate-800">{formatDisplayDate(latestTest.date)}</strong></span>
              </div>
            )}
          </div>

          {/* AKO NEMA TESTA VODE */}
          {!latestTest ? (
            <div className="py-6 px-4 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
              <Droplets size={32} className="mx-auto text-slate-300" />
              <div>
                <p className="text-xs font-black text-slate-800">
                  Za ovaj bazen još nema sačuvanog testa vode.
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Prvo unesite rezultat testa vode kako bi kalkulator automatski izračunao potrebnu hemiju.
                </p>
              </div>

              {onNavigateToWaterTest && (
                <button
                  id="btn-goto-water-test"
                  type="button"
                  onClick={onNavigateToWaterTest}
                  className="py-2.5 px-4 rounded-xl bg-[#0062E3] hover:bg-[#0052C4] text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Droplets size={14} />
                  <span>TESTIRAJ VODU</span>
                </button>
              )}
            </div>
          ) : (
            /* AKO POSTOJI TEST: Prikaz vrijednosti i statusa */
            <div className="space-y-3">
              {/* Upozorenje ako je test stariji od 7 dana */}
              {testIsOutdated && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2 text-amber-800 text-xs font-bold leading-snug">
                    <Clock size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span>⚠️ Vrijeme je za novi test vode.</span>
                      <span className="block text-[10px] font-semibold text-amber-700 mt-0.5">
                        Posljednji test je bio {formatDisplayDate(latestTest.date)}. Preporučuje se novo mjerenje.
                      </span>
                    </div>
                  </div>

                  {onNavigateToWaterTest && (
                    <button
                      type="button"
                      onClick={onNavigateToWaterTest}
                      className="text-[11px] font-extrabold text-[#0062E3] hover:underline whitespace-nowrap pt-0.5 cursor-pointer"
                    >
                      Novi test →
                    </button>
                  )}
                </div>
              )}

              {/* 2 Parametra: pH & Slobodni hlor */}
              <div className="grid grid-cols-2 gap-3">
                {/* pH Card */}
                <div
                  className={`p-3 rounded-2xl border flex flex-col justify-between space-y-1.5 ${
                    phEval?.isIdeal
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      pH
                    </span>
                    <span className="text-sm">{phEval?.iconSymbol}</span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-[#0F172A]">
                      {phEval?.formattedValue}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-500">Idealno: 7,2 – 7,6</span>
                    <span
                      className={`font-black ${
                        phEval?.isIdeal ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {phEval?.statusText}
                    </span>
                  </div>
                </div>

                {/* Slobodni Hlor Card */}
                <div
                  className={`p-3 rounded-2xl border flex flex-col justify-between space-y-1.5 ${
                    chlorineEval?.isIdeal
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Slobodni hlor
                    </span>
                    <span className="text-sm">{chlorineEval?.iconSymbol}</span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#0F172A]">
                      {latestTest.chlorine.toFixed(1).replace('.', ',')}
                    </span>
                    <span className="text-xs font-bold text-slate-500">ppm</span>
                  </div>

                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-500">Idealno: 1,0 – 3,0</span>
                    <span
                      className={`font-black ${
                        chlorineEval?.isIdeal ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {chlorineEval?.statusText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sekundarni link za unos novog mjerenja */}
              {onNavigateToWaterTest && (
                <div className="text-right pt-0.5">
                  <button
                    type="button"
                    onClick={onNavigateToWaterTest}
                    className="text-[11px] font-bold text-[#0062E3] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Unesi novo mjerenje</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* =========================================================================
            PREPORUKA (Automatski na osnovu posljednjeg testa)
            ========================================================================= */}
        {latestTest && (
          <section
            id="section-water-correction"
            className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-blue-500/30 shadow-md space-y-4"
            aria-labelledby="heading-water-correction"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#0062E3] text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h2 id="heading-water-correction" className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                  PREPORUKA
                </h2>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-[#0062E3]">
                Automatski izračun
              </span>
            </div>

            {/* 1A. pH KOREKCIJA */}
            <div className="space-y-2.5">
              {/* Slučaj A: pH je previsok (> 7.6) */}
              {latestTest.ph > 7.6 && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚠️</span>
                      <div>
                        <h3 className="text-xs font-black text-amber-900">
                          pH je previsok ({formatLocalizedNumber(latestTest.ph, 2)})
                        </h3>
                        <span className="text-[11px] font-bold text-amber-700">
                          Preporuka: <strong>pH-</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Odabir pH- proizvoda ako korisnik ima više komada */}
                  {phMinusProducts.length > 0 ? (
                    <div className="space-y-2">
                      {phMinusProducts.length > 1 && (
                        <div className="flex items-center gap-2">
                          <label htmlFor="select-ph-minus-prod" className="text-[10px] font-bold text-slate-500 uppercase">
                            Proizvod:
                          </label>
                          <select
                            id="select-ph-minus-prod"
                            value={selectedPhMinusId}
                            onChange={(e) => setSelectedPhMinusId(e.target.value)}
                            className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1"
                          >
                            {phMinusProducts.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.manufacturerName} – {p.customTitle || p.categoryTitle}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Doza proračun */}
                      {phCorrectionCalculation && (
                        <div className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ProductIcon categoryId="ph_minus" size={24} />
                              <span className="text-xs font-black text-slate-900">
                                {phCorrectionCalculation.productTitle}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-500 block -mb-0.5">Potrebno dodati:</span>
                              <span className="text-base font-black text-[#0062E3]">
                                {phCorrectionCalculation.formattedAmount} {phCorrectionCalculation.unit}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 font-semibold pt-1">
                            {phCorrectionCalculation.subtitle}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-white border border-dashed border-amber-300 text-center space-y-2">
                      <p className="text-xs font-bold text-slate-700">
                        Nemate unesen pH- proizvod u „Moji proizvodi“.
                      </p>
                      {onNavigateToProducts && (
                        <button
                          type="button"
                          onClick={onNavigateToProducts}
                          className="py-1.5 px-3 rounded-lg bg-[#0062E3] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <PlusCircle size={13} />
                          <span>+ Dodaj pH- proizvod</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Slučaj B: pH je prenizak (< 7.2) */}
              {latestTest.ph < 7.2 && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚠️</span>
                      <div>
                        <h3 className="text-xs font-black text-amber-900">
                          pH je prenizak ({formatLocalizedNumber(latestTest.ph, 2)})
                        </h3>
                        <span className="text-[11px] font-bold text-amber-700">
                          Preporuka: <strong>pH+</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {phPlusProducts.length > 0 ? (
                    <div className="space-y-2">
                      {phPlusProducts.length > 1 && (
                        <div className="flex items-center gap-2">
                          <label htmlFor="select-ph-plus-prod" className="text-[10px] font-bold text-slate-500 uppercase">
                            Proizvod:
                          </label>
                          <select
                            id="select-ph-plus-prod"
                            value={selectedPhPlusId}
                            onChange={(e) => setSelectedPhPlusId(e.target.value)}
                            className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1"
                          >
                            {phPlusProducts.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.manufacturerName} – {p.customTitle || p.categoryTitle}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {phCorrectionCalculation && (
                        <div className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ProductIcon categoryId="ph_plus" size={24} />
                              <span className="text-xs font-black text-slate-900">
                                {phCorrectionCalculation.productTitle}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-500 block -mb-0.5">Potrebno dodati:</span>
                              <span className="text-base font-black text-[#0062E3]">
                                {phCorrectionCalculation.formattedAmount} {phCorrectionCalculation.unit}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 font-semibold pt-1">
                            {phCorrectionCalculation.subtitle}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-white border border-dashed border-amber-300 text-center space-y-2">
                      <p className="text-xs font-bold text-slate-700">
                        Nemate unesen pH+ proizvod u „Moji proizvodi“.
                      </p>
                      {onNavigateToProducts && (
                        <button
                          type="button"
                          onClick={onNavigateToProducts}
                          className="py-1.5 px-3 rounded-lg bg-[#0062E3] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <PlusCircle size={13} />
                          <span>+ Dodaj pH+ proizvod</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Slučaj C: pH je u idealnom rasponu (7.2 – 7.6) */}
              {latestTest.ph >= 7.2 && latestTest.ph <= 7.6 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5">
                  <span className="text-base">🟢</span>
                  <div className="text-xs">
                    <strong className="font-black text-emerald-900">pH je u idealnom rasponu</strong>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Nije potrebno dodavati pH- niti pH+. Vrijednost pH {formatLocalizedNumber(latestTest.ph, 2)} je optimalna.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 1B. HLOR KOREKCIJA */}
            <div className="space-y-2.5 pt-1">
              {/* Slučaj A: Hlor je prenizak (< 1.0 ppm) */}
              {latestTest.chlorine < 1.0 && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚠️</span>
                      <div>
                        <h3 className="text-xs font-black text-amber-900">
                          Nivo hlora je prenizak ({latestTest.chlorine.toFixed(1).replace('.', ',')} ppm)
                        </h3>
                        <span className="text-[11px] font-bold text-amber-700">
                          Preporuka: <strong>Hlor</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {chlorineProducts.length > 0 ? (
                    <div className="space-y-2">
                      {chlorineProducts.length > 1 && (
                        <div className="flex items-center gap-2">
                          <label htmlFor="select-cl-prod" className="text-[10px] font-bold text-slate-500 uppercase">
                            Hlorni proizvod:
                          </label>
                          <select
                            id="select-cl-prod"
                            value={selectedChlorineId}
                            onChange={(e) => setSelectedChlorineId(e.target.value)}
                            className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 max-w-[200px] truncate"
                          >
                            {chlorineProducts.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.manufacturerName} – {p.customTitle || p.categoryTitle}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {chlorineCorrectionCalculation && (
                        <div className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ProductIcon categoryId={chlorineCorrectionCalculation.dosageType === 'chlorine_correction' ? 'chlorine_granules' : 'chlorine_granules'} size={24} />
                              <span className="text-xs font-black text-slate-900 truncate max-w-[170px]">
                                {chlorineCorrectionCalculation.productTitle}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-500 block -mb-0.5">Potrebno dodati:</span>
                              <span className="text-base font-black text-[#0062E3]">
                                {chlorineCorrectionCalculation.formattedAmount} {chlorineCorrectionCalculation.unit}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 font-semibold pt-1">
                            {chlorineCorrectionCalculation.subtitle}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-white border border-dashed border-amber-300 text-center space-y-2">
                      <p className="text-xs font-bold text-slate-700">
                        Nemate unesen hlorni proizvod (granule ili šok) u „Moji proizvodi“.
                      </p>
                      {onNavigateToProducts && (
                        <button
                          type="button"
                          onClick={onNavigateToProducts}
                          className="py-1.5 px-3 rounded-lg bg-[#0062E3] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <PlusCircle size={13} />
                          <span>+ Dodaj hlorni proizvod</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Slučaj B: Hlor je u idealnom rasponu (1.0 – 3.0 ppm) */}
              {latestTest.chlorine >= 1.0 && latestTest.chlorine <= 3.0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5">
                  <span className="text-base">🟢</span>
                  <div className="text-xs">
                    <strong className="font-black text-emerald-900">Nivo hlora je u idealnom rasponu</strong>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Nije potrebno dodatno hlorisanje. Slobodni hlor ({latestTest.chlorine.toFixed(1).replace('.', ',')} ppm) je optimalan.
                    </p>
                  </div>
                </div>
              )}

              {/* Slučaj C: Hlor je previsok (> 3.0 ppm) */}
              {latestTest.chlorine > 3.0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center gap-2.5">
                  <span className="text-base">🔴</span>
                  <div className="text-xs">
                    <strong className="font-black text-rose-900">Nivo hlora je previsok ({latestTest.chlorine.toFixed(1).replace('.', ',')} ppm)</strong>
                    <p className="text-[11px] text-rose-700 font-medium mt-0.5">
                      NE preporučuje se dodatno hlorisanje. Pustite da nivo hlora prirodno opadne na suncu i kroz filtraciju prije kupanja.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =========================================================================
            CJELINA 2: REDOVNO ODRŽAVANJE (Ručno odabrano)
            ========================================================================= */}
        <section
          id="section-regular-maintenance"
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4"
          aria-labelledby="heading-regular-maintenance"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h2 id="heading-regular-maintenance" className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                REDOVNO ODRŽAVANJE
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              (Odaberite po potrebi)
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Sredstva za redovnu prevenciju i bistrenje (algicid, flokulant, kristal, tablete za sporo otapanje) primjenjuju se prema rasporedu na deklaraciji.
          </p>

          {maintenanceProducts.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
              <Package size={28} className="mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-700">
                Nemate dodanih sredstava za redovno održavanje.
              </p>
              {onNavigateToProducts && (
                <button
                  type="button"
                  onClick={onNavigateToProducts}
                  className="py-2 px-3.5 rounded-xl bg-[#0062E3] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle size={14} />
                  <span>+ Dodaj proizvode</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Grid of Maintenance Products to select */}
              <div className="grid grid-cols-2 gap-2.5">
                {maintenanceProducts.map((p) => {
                  const isSelected = selectedMaintProductId === p.id;

                  return (
                    <button
                      key={p.id}
                      id={`btn-maint-prod-${p.id}`}
                      type="button"
                      onClick={() => setSelectedMaintProductId(p.id)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[96px] relative ${
                        isSelected
                          ? 'bg-blue-50/80 border-2 border-[#0062E3] shadow-sm shadow-blue-500/15 ring-2 ring-blue-500/10'
                          : 'bg-[#F8FAFC] border-slate-200/80 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-1">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 shadow-2xs flex items-center justify-center p-1">
                          <ProductIcon categoryId={p.categoryId} size={28} />
                        </div>
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#0062E3] text-white shadow-xs'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check size={10} strokeWidth={3.5} />}
                        </div>
                      </div>

                      <div>
                        <span
                          className={`block text-xs font-extrabold leading-tight truncate ${
                            isSelected ? 'text-[#0062E3]' : 'text-slate-800'
                          }`}
                        >
                          {p.customTitle || p.categoryTitle}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 block truncate">
                          {p.manufacturerName}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Maintenance Calculation Result Card */}
              {maintenanceCalculation && selectedMaintProduct && (
                <div
                  id="card-maint-calc-result"
                  className="p-4 rounded-2xl bg-gradient-to-b from-[#EBF4FC] to-blue-50/40 border border-blue-200 shadow-2xs space-y-2 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-blue-100/80 pb-2">
                    <div className="flex items-center gap-2">
                      <ProductIcon categoryId={selectedMaintProduct.categoryId} size={26} />
                      <div>
                        <h3 className="text-xs font-black text-slate-900">
                          {selectedMaintProduct.customTitle || selectedMaintProduct.categoryTitle}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {selectedMaintProduct.manufacturerName}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block leading-none">
                        Doza za vaš bazen:
                      </span>
                      <span className="text-xl font-black text-[#0062E3] leading-tight">
                        {maintenanceCalculation.formattedAmount}{' '}
                        <span className="text-sm font-bold text-[#0062E3]">
                          {maintenanceCalculation.unit}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-semibold">{maintenanceCalculation.subtitle}</p>
                    {selectedMaintProduct.dosage.frequency && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0062E3] pt-0.5">
                        <Clock size={13} />
                        <span>
                          Učestalost: {formatFrequencyLabel(selectedMaintProduct.dosage.frequency, selectedMaintProduct.dosage.frequencyDays)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

