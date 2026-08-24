import React from 'react';
import { Home, FlaskConical, Calculator, Droplet, Settings } from 'lucide-react';
import { AppTab } from '../../types/navigation';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: AppTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'home', label: 'Početna', icon: Home },
    { id: 'my-pool', label: 'Moj bazen', icon: FlaskConical },
    { id: 'water-test', label: 'Test vode', icon: Droplet },
    { id: 'calculator', label: 'Kalkulator', icon: Calculator },
    { id: 'settings', label: 'Podešavanja', icon: Settings },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="w-full flex-shrink-0 sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around z-30 select-none transition-colors"
      aria-label="Glavna navigacija"
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            id={`nav-item-${item.id}`}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-150 group focus:outline-none cursor-pointer ${
              isActive
                ? 'text-[#0062E3] dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            {/* Top active indicator line */}
            {isActive && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#0062E3] dark:bg-blue-400 rounded-full" />
            )}

            <div className="relative flex items-center justify-center w-6 h-6 mb-1">
              <IconComponent
                size={22}
                className={`transition-transform duration-150 ${
                  isActive
                    ? 'scale-105 stroke-[#0062E3] dark:stroke-blue-400 fill-[#0062E3]/15'
                    : 'stroke-current group-hover:scale-105'
                }`}
              />
            </div>

            <span
              className={`text-[11px] leading-tight transition-colors ${
                isActive ? 'text-[#0062E3] dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
