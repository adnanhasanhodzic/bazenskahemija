import React from 'react';
import {
  PlusCircle,
  ShieldCheck,
  Waves,
  FlaskConical,
  Calculator,
  TestTube2,
  Droplet,
  Settings,
  Pencil,
  Package,
} from 'lucide-react';
import { Pool } from '../../types/pool';
import { AppTab } from '../../types/navigation';
import { PoolIllustration } from '../common/PoolIllustration';
import { PoolHeroBanner } from './PoolHeroBanner';
import { PoolThumbnailIcon } from './PoolThumbnailIcon';
import { formatLiters } from '../../utils/poolCalculations';

interface HomeScreenProps {
  activePool: Pool | null;
  onAddPool: () => void;
  onEditPool: (pool: Pool) => void;
  onNavigateTab: (tab: AppTab) => void;
  onOpenProducts?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activePool,
  onAddPool,
  onEditPool,
  onNavigateTab,
  onOpenProducts,
}) => {
  const getShapeName = (shape: string) => {
    switch (shape) {
      case 'round':
        return 'Okrugli bazen';
      case 'rectangular':
        return 'Pravougaoni bazen';
      case 'oval':
        return 'Ovalni bazen';
      default:
        return 'Bazen';
    }
  };

  const getDimensionSummary = (pool: Pool) => {
    if (pool.shape === 'round') {
      return `Ø ${pool.diameter} cm • Visina ${pool.height} cm`;
    }
    return `${pool.length} × ${pool.width} cm • Visina ${pool.height} cm`;
  };

  // 1. If NO pool saved: Display clean Welcome / Empty State
  if (!activePool) {
    return (
      <div className="w-full flex flex-col px-4 py-3 pb-6 max-w-lg mx-auto">
        {/* Welcome Empty State Card */}
        <section
          id="card-welcome-empty-state"
          className="w-full bg-[#EBF4FC]/95 dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 flex flex-col items-center border border-blue-100/80 dark:border-slate-700/80 shadow-[0_4px_20px_rgba(0,102,255,0.06)] transition-colors"
        >
          {/* Pool Illustration with Question Mark */}
          <div className="w-full max-w-[280px] sm:max-w-[310px] -mt-2">
            <PoolIllustration variant="empty-state" />
          </div>

          <h2 className="text-2xl font-black text-[#0B1527] dark:text-white text-center tracking-tight mt-1">
            Dobrodošli!
          </h2>

          <p className="text-sm font-bold text-[#1E293B] dark:text-slate-200 text-center mt-1">
            Još niste dodali bazen.
          </p>

          <p className="text-xs text-[#475569] dark:text-slate-400 text-center leading-relaxed mt-2 max-w-xs sm:max-w-sm">
            Da biste izračunavali potrebne količine hemije i testirali vrijednosti vode, potrebno je prvo odabrati ili dodati vaš bazen.
          </p>

          {/* Primary CTA Button */}
          <button
            id="btn-add-my-pool-hero"
            type="button"
            onClick={onAddPool}
            className="w-full mt-5 py-3.5 px-6 rounded-2xl bg-[#0062E3] hover:bg-[#0052C4] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/25 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            <PlusCircle size={22} strokeWidth={2.4} className="stroke-white" />
            <span>Dodaj moj bazen</span>
          </button>
        </section>

        {/* Section: "Kako koristiti aplikaciju?" */}
        <section className="w-full mt-6" aria-labelledby="heading-how-to-use">
          <h3
            id="heading-how-to-use"
            className="text-base font-extrabold text-[#0F172A] dark:text-white text-center mb-3.5 tracking-tight"
          >
            Kako koristiti aplikaciju?
          </h3>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-2 sm:p-2.5 flex flex-col items-center text-center shadow-xs">
              <div className="w-5 h-5 rounded-full bg-[#0062E3] text-white font-extrabold text-[11px] flex items-center justify-center mb-2">
                1
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50/70 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center mb-1.5">
                <Waves size={20} strokeWidth={2.2} />
              </div>
              <h4 className="text-[11px] font-bold text-[#0F172A] dark:text-white leading-tight">
                Dodajte bazen
              </h4>
              <p className="text-[9px] text-[#64748B] dark:text-slate-400 mt-1 leading-snug">
                Unesite dimenzije i zapreminu.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-2 sm:p-2.5 flex flex-col items-center text-center shadow-xs">
              <div className="w-5 h-5 rounded-full bg-[#0062E3] text-white font-extrabold text-[11px] flex items-center justify-center mb-2">
                2
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50/70 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center mb-1.5">
                <FlaskConical size={20} strokeWidth={2.2} />
              </div>
              <h4 className="text-[11px] font-bold text-[#0F172A] dark:text-white leading-tight">
                Odaberite hemiju
              </h4>
              <p className="text-[9px] text-[#64748B] dark:text-slate-400 mt-1 leading-snug">
                Izaberite proizvod i doziranje.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-2 sm:p-2.5 flex flex-col items-center text-center shadow-xs">
              <div className="w-5 h-5 rounded-full bg-[#0062E3] text-white font-extrabold text-[11px] flex items-center justify-center mb-2">
                3
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50/70 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center mb-1.5">
                <Calculator size={20} strokeWidth={2.2} />
              </div>
              <h4 className="text-[11px] font-bold text-[#0F172A] dark:text-white leading-tight">
                Izračunajte količinu
              </h4>
              <p className="text-[9px] text-[#64748B] dark:text-slate-400 mt-1 leading-snug">
                Aplikacija računa tačnu količinu.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-2 sm:p-2.5 flex flex-col items-center text-center shadow-xs">
              <div className="w-5 h-5 rounded-full bg-[#0062E3] text-white font-extrabold text-[11px] flex items-center justify-center mb-2">
                4
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50/70 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center mb-1.5">
                <TestTube2 size={20} strokeWidth={2.2} />
              </div>
              <h4 className="text-[11px] font-bold text-[#0F172A] dark:text-white leading-tight">
                Testirajte vodu
              </h4>
              <p className="text-[9px] text-[#64748B] dark:text-slate-400 mt-1 leading-snug">
                Unesite izmjerene vrijednosti.
              </p>
            </div>
          </div>
        </section>

        {/* Info card */}
        <section
          id="card-info-guidance"
          className="w-full bg-[#EBF4FC]/85 dark:bg-slate-800/90 rounded-2xl p-3.5 sm:p-4 mt-5 flex items-center gap-3.5 border border-blue-100 dark:border-slate-700/80 shadow-xs transition-colors"
        >
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-700 text-[#0062E3] dark:text-blue-400 flex-shrink-0 flex items-center justify-center shadow-xs border border-blue-100 dark:border-slate-600">
            <ShieldCheck size={26} strokeWidth={2.2} className="text-[#0062E3] dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
              Tačni rezultati uz tačne podatke
            </h4>
            <p className="text-[11px] sm:text-xs text-[#475569] dark:text-slate-400 leading-relaxed mt-0.5">
              Unosite tačne dimenzije bazena i koristite doziranje prema preporukama proizvođača.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // 2. If ACTIVE POOL EXISTS: Show Dashboard as in reference image!
  return (
    <div className="w-full flex flex-col pb-8 bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Top Pool Photo / Hero Banner */}
      <PoolHeroBanner shape={activePool.shape} />

      {/* Main Container below banner with Active Pool Card */}
      <div className="px-4 pt-1 sm:pt-2 relative z-10 flex flex-col max-w-lg mx-auto w-full">
        {/* Floating Active Pool Card */}
        <section
          id="card-active-pool-dashboard"
          className="w-full bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.08)] relative transition-colors"
        >
          {/* Top indicator badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/40 rounded-full text-[11px] font-bold text-[#0062E3] dark:text-blue-400 mb-3">
            <span>Moj bazen</span>
          </div>

          {/* Upper Section: Pool Icon + Details */}
          <div className="flex items-start gap-3.5">
            <PoolThumbnailIcon shape={activePool.shape} size={54} />

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-extrabold text-[#0F172A] dark:text-white truncate">
                {activePool.name || getShapeName(activePool.shape)}
              </h2>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                {getDimensionSummary(activePool)}
              </p>
              <p className="text-xs font-bold text-[#0062E3] dark:text-blue-400 mt-0.5">
                {activePool.fillPercentage}% popunjen
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-slate-100 dark:bg-slate-700 my-4" />

          {/* Lower Section: Volume & Edit Button */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-none mb-1.5">
                Zapremina vode
              </p>
              <div className="text-2xl sm:text-3xl font-black text-[#0062E3] dark:text-blue-400 tracking-tight leading-none">
                {formatLiters(activePool.workingVolumeLiters)}{' '}
                <span className="text-lg font-bold text-[#0062E3] dark:text-blue-400">L</span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-1">
                Radna zapremina ({activePool.fillPercentage}%)
              </p>
            </div>

            {/* Edit Pool Icon Button */}
            <button
              id="btn-edit-active-pool"
              type="button"
              onClick={() => onEditPool(activePool)}
              className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 hover:text-[#0062E3] dark:hover:text-blue-400 active:bg-blue-100 flex items-center justify-center transition-colors border border-slate-200/80 dark:border-slate-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Uredi bazen"
              title="Uredi bazen"
            >
              <Pencil size={18} strokeWidth={2.2} />
            </button>
          </div>
        </section>

        {/* Section: "Brzi pristup" (Quick Access) */}
        <section className="w-full mt-6" aria-labelledby="heading-quick-access">
          <h3
            id="heading-quick-access"
            className="text-base font-extrabold text-[#0F172A] dark:text-white mb-3 tracking-tight"
          >
            Brzi pristup
          </h3>

          {/* 2x2 Grid of Actions matching reference image */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Kalkulator hemije (Highlighted Blue) */}
            <button
              id="btn-quick-calculator"
              type="button"
              onClick={() => onNavigateTab('calculator')}
              className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/60 dark:hover:bg-blue-900/50 active:scale-[0.98] border-2 border-[#0062E3] dark:border-blue-500 flex items-center gap-3 transition-all duration-150 cursor-pointer text-left focus:outline-none shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-[#0062E3] dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-blue-200 dark:border-blue-800">
                <FlaskConical size={22} strokeWidth={2.3} className="text-[#0062E3] dark:text-blue-400" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0062E3] dark:text-blue-400 leading-snug">
                Kalkulator hemije
              </span>
            </button>

            {/* 2. Test vode */}
            <button
              id="btn-quick-water-test"
              type="button"
              onClick={() => onNavigateTab('water-test')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-[0.98] border border-slate-200/90 dark:border-slate-700 flex items-center gap-3 transition-all duration-150 cursor-pointer text-left focus:outline-none shadow-xs group hover:border-slate-300"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <Droplet size={22} strokeWidth={2.3} className="fill-[#0062E3]/20" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Test vode
              </span>
            </button>

            {/* 3. Moji proizvodi */}
            <button
              id="btn-quick-my-products"
              type="button"
              onClick={() => {
                if (onOpenProducts) {
                  onOpenProducts();
                } else {
                  onNavigateTab('settings');
                }
              }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-[0.98] border border-slate-200/90 dark:border-slate-700 flex items-center gap-3 transition-all duration-150 cursor-pointer text-left focus:outline-none shadow-xs group hover:border-slate-300"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Package size={22} strokeWidth={2.3} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Moji proizvodi
              </span>
            </button>

            {/* 4. Podešavanja */}
            <button
              id="btn-quick-settings"
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-[0.98] border border-slate-200/90 dark:border-slate-700 flex items-center gap-3 transition-all duration-150 cursor-pointer text-left focus:outline-none shadow-xs group hover:border-slate-300"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                <Settings size={22} strokeWidth={2.3} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Podešavanja
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
