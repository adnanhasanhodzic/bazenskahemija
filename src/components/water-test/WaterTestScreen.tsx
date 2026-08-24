import React, { useState, useMemo, useEffect } from 'react';
import {
  Droplet,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ArrowRight,
  History,
  AlertCircle,
  PlusCircle,
  FlaskConical,
} from 'lucide-react';
import { Pool } from '../../types/pool';
import { WaterTestRecord } from '../../types/waterTest';
import {
  getWaterTestsForPool,
  saveWaterTest,
  deleteWaterTest,
  getTodayFormattedIso,
  formatDisplayDate,
  evaluatePhValue,
  evaluateChlorineValue,
} from '../../utils/waterTestStorage';
import { parseLocalizedNumber } from '../../utils/calculatorMath';

interface WaterTestScreenProps {
  activePool: Pool | null;
  allPools?: Pool[];
  onNavigateToCalculator?: () => void;
  onNavigateToAddPool?: () => void;
  onSelectActivePoolId?: (poolId: string) => void;
}

export const WaterTestScreen: React.FC<WaterTestScreenProps> = ({
  activePool,
  allPools = [],
  onNavigateToCalculator,
  onNavigateToAddPool,
  onSelectActivePoolId,
}) => {
  // 1. Selected Pool State
  const [selectedPoolId, setSelectedPoolId] = useState<string>(() => {
    if (activePool) return activePool.id;
    if (allPools.length > 0) return allPools[0].id;
    return '';
  });

  // Sync when activePool changes
  useEffect(() => {
    if (activePool && activePool.id !== selectedPoolId) {
      setSelectedPoolId(activePool.id);
    }
  }, [activePool]);

  // Current pool object
  const currentPool = useMemo(() => {
    if (!selectedPoolId) return activePool || (allPools.length > 0 ? allPools[0] : null);
    return allPools.find((p) => p.id === selectedPoolId) || activePool || null;
  }, [selectedPoolId, allPools, activePool]);

  // 2. Form Inputs
  const [testDate, setTestDate] = useState<string>(() => getTodayFormattedIso());
  const [inputPh, setInputPh] = useState<string>('');
  const [inputChlorine, setInputChlorine] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // 3. Tests History
  const [testsHistory, setTestsHistory] = useState<WaterTestRecord[]>(() => {
    return currentPool ? getWaterTestsForPool(currentPool.id) : [];
  });

  // Test ID to delete confirmation
  const [testToDelete, setTestToDelete] = useState<WaterTestRecord | null>(null);

  // Refresh history when selected pool changes
  useEffect(() => {
    if (currentPool) {
      setTestsHistory(getWaterTestsForPool(currentPool.id));
    } else {
      setTestsHistory([]);
    }
  }, [currentPool]);

  // Parsed values for live evaluation
  const parsedPh = parseLocalizedNumber(inputPh);
  const parsedChlorine = parseLocalizedNumber(inputChlorine);

  const phEval = useMemo(() => {
    if (parsedPh === null || isNaN(parsedPh) || parsedPh <= 0) return null;
    return evaluatePhValue(parsedPh);
  }, [parsedPh]);

  const chlorineEval = useMemo(() => {
    if (parsedChlorine === null || isNaN(parsedChlorine) || parsedChlorine < 0) return null;
    return evaluateChlorineValue(parsedChlorine);
  }, [parsedChlorine]);

  // Handle Save Test
  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaveSuccessMsg(null);

    if (!currentPool) {
      setFormError('Molimo prvo dodajte ili odaberite bazen.');
      return;
    }

    if (parsedPh === null || parsedPh <= 0 || parsedPh < 5.0 || parsedPh > 9.5) {
      setFormError('Molimo unesite ispravnu pH vrijednost (npr. 7,4 ili 7.8).');
      return;
    }

    if (parsedChlorine === null || parsedChlorine < 0 || parsedChlorine > 15.0) {
      setFormError('Molimo unesite ispravnu vrijednost slobodnog hlora u ppm (npr. 0,5 ili 1.5).');
      return;
    }

    // Save to storage
    const saved = saveWaterTest({
      poolId: currentPool.id,
      date: testDate || getTodayFormattedIso(),
      ph: parsedPh,
      chlorine: parsedChlorine,
    });

    // Refresh history
    setTestsHistory(getWaterTestsForPool(currentPool.id));
    setSaveSuccessMsg(`Test vode od ${formatDisplayDate(saved.date)} je uspješno sačuvan.`);

    // Reset inputs
    setInputPh('');
    setInputChlorine('');
  };

  // Handle Delete Test
  const handleConfirmDelete = () => {
    if (!testToDelete || !currentPool) return;
    deleteWaterTest(testToDelete.id);
    setTestsHistory(getWaterTestsForPool(currentPool.id));
    setTestToDelete(null);
  };

  return (
    <div className="w-full flex flex-col bg-[#F8FAFC] min-h-full pb-20 select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0062E3] flex items-center justify-center">
            <Droplet size={18} strokeWidth={2.4} className="fill-[#0062E3]/20" />
          </div>
          <h1 className="text-base font-black text-[#0F172A] tracking-tight">
            Test vode
          </h1>
        </div>

        {currentPool && (
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-[#0062E3] border border-blue-100">
            {(currentPool.workingVolumeLiters / 1000).toLocaleString('de-DE', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}{' '}
            m³
          </span>
        )}
      </header>

      {/* Main Container */}
      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto w-full">
        {/* =========================================================================
            1. BAZEN SELECTOR
            ========================================================================= */}
        {allPools.length > 0 ? (
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="select-water-test-pool"
                className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500"
              >
                Bazen za testiranje
              </label>
              {currentPool && (
                <span className="text-[11px] font-semibold text-slate-500">
                  {currentPool.workingVolumeLiters.toLocaleString('de-DE')} L
                </span>
              )}
            </div>

            <div className="relative">
              <select
                id="select-water-test-pool"
                value={selectedPoolId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedPoolId(newId);
                  if (onSelectActivePoolId) {
                    onSelectActivePoolId(newId);
                  }
                  setSaveSuccessMsg(null);
                  setFormError(null);
                }}
                className="w-full appearance-none px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] pr-10 cursor-pointer shadow-2xs"
              >
                {allPools.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name || 'Moj bazen'}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 rounded-3xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <AlertCircle size={16} />
              <span>Još nemate dodan bazen</span>
            </div>
            <p className="text-xs text-amber-700">
              Dodajte svoj bazen kako biste mogli sačuvati test vode i precizno računati hemiju.
            </p>
            {onNavigateToAddPool && (
              <button
                type="button"
                onClick={onNavigateToAddPool}
                className="py-2 px-3.5 rounded-xl bg-[#0062E3] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle size={15} />
                <span>+ Dodaj bazen</span>
              </button>
            )}
          </div>
        )}

        {/* =========================================================================
            2. IDEALNE VRIJEDNOSTI (Referentni standard)
            ========================================================================= */}
        <section
          id="section-water-ideals-banner"
          className="bg-blue-50/70 rounded-2xl px-4 py-3 border border-blue-100/90 flex items-center justify-between shadow-2xs"
          aria-label="Idealne vrijednosti vode"
        >
          <div className="flex items-center gap-2 min-w-0 w-full whitespace-nowrap overflow-hidden">
            <Sparkles size={14} className="text-[#0062E3] flex-shrink-0" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#0062E3] flex-shrink-0">
              Idealne vrijednosti:
            </span>
            <span className="text-[11px] font-bold text-slate-600 flex-shrink-0">pH:</span>
            <strong className="text-[11px] font-black text-slate-900 flex-shrink-0">7,2 – 7,6</strong>
            <span className="text-slate-300 flex-shrink-0">•</span>
            <span className="text-[11px] font-bold text-slate-600 flex-shrink-0">Hlor:</span>
            <strong className="text-[11px] font-black text-slate-900 flex-shrink-0">1,0 – 3,0 ppm</strong>
          </div>
        </section>

        {/* =========================================================================
            3. UNOS NOVOG TESTA VODE
            ========================================================================= */}
        <section
          id="section-new-water-test-form"
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Droplet size={15} className="text-[#0062E3]" />
              <span>Unos rezultata testiranja</span>
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              Izmjereno testerom
            </span>
          </div>

          <form onSubmit={handleSaveTest} className="space-y-3.5">
            {/* Datum testiranja */}
            <div className="space-y-1">
              <label
                htmlFor="input-test-date"
                className="block text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                <Calendar size={13} className="text-slate-500" />
                <span>Datum testiranja</span>
              </label>
              <input
                id="input-test-date"
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] shadow-2xs cursor-pointer"
              />
            </div>

            {/* pH i Slobodni hlor Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* pH Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-water-ph" className="block text-xs font-bold text-slate-700">
                    pH <span className="text-rose-500">*</span>
                  </label>
                  {phEval && (
                    <span
                      className={`text-[10px] font-extrabold flex items-center gap-0.5 ${
                        phEval.isIdeal
                          ? 'text-emerald-600'
                          : phEval.status === 'above'
                          ? 'text-rose-600'
                          : 'text-sky-600'
                      }`}
                    >
                      <span>{phEval.iconSymbol}</span>
                      <span>{phEval.statusText}</span>
                    </span>
                  )}
                </div>

                <input
                  id="input-water-ph"
                  type="text"
                  inputMode="decimal"
                  placeholder="npr. 7,8"
                  value={inputPh}
                  onChange={(e) => {
                    setInputPh(e.target.value);
                    setSaveSuccessMsg(null);
                    setFormError(null);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] shadow-2xs ${
                    phEval
                      ? phEval.isIdeal
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-rose-300 bg-rose-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                />
              </div>

              {/* Slobodni hlor Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-water-chlorine" className="block text-xs font-bold text-slate-700">
                    Slobodni hlor <span className="text-rose-500">*</span>
                  </label>
                  {chlorineEval && (
                    <span
                      className={`text-[10px] font-extrabold flex items-center gap-0.5 ${
                        chlorineEval.isIdeal
                          ? 'text-emerald-600'
                          : chlorineEval.status === 'above'
                          ? 'text-rose-600'
                          : 'text-sky-600'
                      }`}
                    >
                      <span>{chlorineEval.iconSymbol}</span>
                      <span>{chlorineEval.statusText}</span>
                    </span>
                  )}
                </div>

                <div
                  className={`flex rounded-2xl overflow-hidden border bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-[#0062E3] shadow-2xs ${
                    chlorineEval
                      ? chlorineEval.isIdeal
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-rose-300 bg-rose-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <input
                    id="input-water-chlorine"
                    type="text"
                    inputMode="decimal"
                    placeholder="npr. 0,5"
                    value={inputChlorine}
                    onChange={(e) => {
                      setInputChlorine(e.target.value);
                      setSaveSuccessMsg(null);
                      setFormError(null);
                    }}
                    className="w-full px-3.5 py-2.5 text-xs font-black text-slate-900 focus:outline-none"
                  />
                  <div className="bg-slate-100 border-l border-slate-200 px-3 py-2.5 text-xs font-extrabold text-slate-600 flex items-center">
                    ppm
                  </div>
                </div>
              </div>
            </div>

            {/* Form Error Banner */}
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Success Message Banner */}
            {saveSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>

                {onNavigateToCalculator && (
                  <button
                    type="button"
                    onClick={onNavigateToCalculator}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0062E3] hover:bg-[#0052C4] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <FlaskConical size={15} />
                    <span>Idi u Kalkulator na proračun</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}

            {/* SPREMI TEST CTA Button */}
            <button
              id="btn-save-water-test"
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0062E3] hover:bg-[#0052C4] active:scale-[0.98] text-white font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
            >
              <span>SPREMI TEST</span>
            </button>
          </form>
        </section>

        {/* =========================================================================
            4. HISTORIJA PRETHODNIH TESTOVA
            ========================================================================= */}
        <section
          id="section-water-tests-history"
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3"
          aria-labelledby="heading-tests-history"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2
              id="heading-tests-history"
              className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5"
            >
              <History size={14} className="text-slate-500" />
              <span>Historija testova</span>
            </h2>
            <span className="text-[11px] font-extrabold text-[#0062E3]">
              {testsHistory.length}{' '}
              {testsHistory.length === 1 ? 'sačuvan test' : 'sačuvanih testova'}
            </span>
          </div>

          {testsHistory.length === 0 ? (
            <div className="py-8 px-4 text-center space-y-2 bg-[#F8FAFC] rounded-2xl border border-dashed border-slate-200">
              <Droplet size={28} className="mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">
                Za ovaj bazen još nema sačuvanih testova.
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Unesite izmjerene vrijednosti pH i hlora iznad i kliknite „SPREMI TEST“.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {testsHistory.map((test, index) => {
                const isLatest = index === 0;
                const phEvaluation = evaluatePhValue(test.ph);
                const clEvaluation = evaluateChlorineValue(test.chlorine);

                return (
                  <div
                    key={test.id}
                    id={`test-history-item-${test.id}`}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isLatest
                        ? 'bg-blue-50/40 border-blue-200 shadow-2xs'
                        : 'bg-[#F8FAFC] border-slate-200/80 hover:bg-white'
                    }`}
                  >
                    {/* Left: Date & Status Badges */}
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#0F172A]">
                          {formatDisplayDate(test.date)}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#0062E3] text-white">
                            Posljednji test
                          </span>
                        )}
                      </div>

                      {/* Values */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {/* pH */}
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-extrabold ${phEvaluation.badgeClass}`}
                        >
                          <span>pH {phEvaluation.formattedValue}</span>
                          <span>{phEvaluation.iconSymbol}</span>
                        </div>

                        {/* Chlorine */}
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-extrabold ${clEvaluation.badgeClass}`}
                        >
                          <span>Hlor {clEvaluation.formattedValue}</span>
                          <span>{clEvaluation.iconSymbol}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Delete Test Action */}
                    <button
                      id={`btn-delete-test-${test.id}`}
                      type="button"
                      onClick={() => setTestToDelete(test)}
                      className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                      title="Obriši ovaj test"
                      aria-label="Obriši test"
                    >
                      <Trash2 size={15} strokeWidth={2.2} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Delete Test Modal */}
      {testToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} strokeWidth={2.4} />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A] leading-tight">
                  Obriši test vode?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Test od {formatDisplayDate(testToDelete.date)}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Da li ste sigurni da želite ukloniti ovaj test vode iz historije?
            </p>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setTestToDelete(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Odustani
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
