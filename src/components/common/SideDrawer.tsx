import React from 'react';
import { X, Home, FlaskConical, Calculator, Package, Droplet, Settings, HelpCircle, Info, RefreshCw } from 'lucide-react';
import { Logo } from './Logo';
import { AppTab } from '../../types/navigation';

interface SideDrawerProps {
  isOpen: boolean;
  activeTab: AppTab;
  onClose: () => void;
  onSelectTab: (tab: AppTab) => void;
  onReplaySplash: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  activeTab,
  onClose,
  onSelectTab,
  onReplaySplash,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div
        id="side-menu-drawer"
        className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 transition-colors"
      >
        <div>
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white dark:from-slate-800/80 dark:to-slate-900">
            <Logo size="sm" layout="horizontal" />
            <button
              id="btn-close-side-drawer"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Menu List */}
          <div className="p-4 space-y-1">
            <button
              type="button"
              onClick={() => {
                onSelectTab('home');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-colors text-left cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#0062E3] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 font-black'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
              }`}
            >
              <Home size={20} className={activeTab === 'home' ? 'text-[#0062E3] dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />
              <span>Početna</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('my-pool');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-colors text-left cursor-pointer ${
                activeTab === 'my-pool'
                  ? 'text-[#0062E3] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 font-black'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
              }`}
            >
              <FlaskConical size={20} className={activeTab === 'my-pool' ? 'text-[#0062E3] dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />
              <span>Moj bazen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('water-test');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-colors text-left cursor-pointer ${
                activeTab === 'water-test'
                  ? 'text-[#0062E3] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 font-black'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
              }`}
            >
              <Droplet size={20} className={activeTab === 'water-test' ? 'text-[#0062E3] dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />
              <span>Test vode</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('calculator');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-colors text-left cursor-pointer ${
                activeTab === 'calculator'
                  ? 'text-[#0062E3] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 font-black'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
              }`}
            >
              <Calculator size={20} className={activeTab === 'calculator' ? 'text-[#0062E3] dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />
              <span>Kalkulator</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('my-products');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-colors text-left cursor-pointer ${
                activeTab === 'my-products'
                  ? 'text-[#0062E3] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 font-black'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
              }`}
            >
              <Package size={20} className={activeTab === 'my-products' ? 'text-[#0062E3] dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />
              <span>Moji proizvodi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('settings');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-colors text-left cursor-pointer ${
                activeTab === 'settings'
                  ? 'text-[#0062E3] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 font-black'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
              }`}
            >
              <Settings size={20} className={activeTab === 'settings' ? 'text-[#0062E3] dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />
              <span>Podešavanja</span>
            </button>
          </div>

          <div className="px-4 py-2">
            <div className="border-t border-slate-100 dark:border-slate-800 my-2" />
            <button
              type="button"
              onClick={() => {
                onClose();
                onReplaySplash();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#0062E3] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors text-left cursor-pointer"
            >
              <RefreshCw size={17} />
              <span>Ponovo prikaži Splash ekran</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 mb-1">
            <Info size={14} className="text-[#0062E3] dark:text-blue-400" />
            <span className="font-bold text-slate-700 dark:text-slate-200">BAZEN – KALKULATOR HEMIJE</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Verzija 1.0.0</p>
        </div>
      </div>
    </div>
  );
};
