import React from 'react';
import { ArrowLeft, Calculator, Droplet, Settings, Sparkles } from 'lucide-react';
import { AppTab } from '../../types/navigation';

interface FeaturePlaceholderProps {
  tab: AppTab;
  onBack: () => void;
}

export const FeaturePlaceholder: React.FC<FeaturePlaceholderProps> = ({ tab, onBack }) => {
  const meta = {
    calculator: {
      title: 'Kalkulator Hemije',
      subtitle: 'Proračun doziranja pH minus/plus, hlora, algicida i flokulanata',
      phase: 'Faza 3',
      icon: Calculator,
    },
    'water-test': {
      title: 'Test Vode',
      subtitle: 'Unos i praćenje izmjerenih vrijednosti vode (pH, hlor)',
      phase: 'Faza 4',
      icon: Droplet,
    },
    settings: {
      title: 'Podešavanja',
      subtitle: 'Prilagođavanje mjernih jedinica i postavki aplikacije',
      phase: 'Faza 5',
      icon: Settings,
    },
    home: {
      title: 'Početna',
      subtitle: '',
      phase: '',
      icon: Sparkles,
    },
    'my-pool': {
      title: 'Moj bazen',
      subtitle: '',
      phase: '',
      icon: Sparkles,
    },
  }[tab];

  const Icon = meta.icon;

  return (
    <div className="w-full flex flex-col px-4 py-3 pb-8 max-w-lg mx-auto">
      {/* Back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#0062E3] hover:text-[#0048A8] transition-colors -ml-1 py-1 px-2 rounded-lg hover:bg-blue-50"
        >
          <ArrowLeft size={18} strokeWidth={2.4} />
          <span>Početna</span>
        </button>
        <h2 className="text-base font-extrabold text-[#0F172A]">{meta.title}</h2>
        <div className="w-16" />
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center my-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0062E3] flex items-center justify-center mb-4">
          <Icon size={32} strokeWidth={2.2} />
        </div>

        <span className="px-3 py-1 bg-blue-100/70 text-[#0062E3] rounded-full text-xs font-bold mb-3">
          Planirano za {meta.phase}
        </span>

        <h3 className="text-xl font-black text-[#0F172A]">{meta.title}</h3>
        <p className="text-xs text-[#475569] mt-2 max-w-xs leading-relaxed">
          {meta.subtitle}
        </p>

        <p className="text-[11px] text-slate-400 mt-6 bg-slate-50 p-3 rounded-xl border border-slate-100 w-full">
          U Fazi 1 fokus je na vizuelnom identitetu, Splash ekranu i Empty State početnoj stranici prema dostavljenim referencama.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-6 w-full py-3 bg-[#0062E3] hover:bg-[#0052C4] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          Povratak na početnu
        </button>
      </div>
    </div>
  );
};
