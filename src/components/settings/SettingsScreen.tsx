import React, { useState } from 'react';
import {
  ArrowLeft,
  Palette,
  Sun,
  Moon,
  Laptop,
  Bell,
  Check,
  Info,
  AlertTriangle,
  User,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { AppSettings, AppThemeSetting } from '../../utils/settingsStorage';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onBackToHome?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onBackToHome,
}) => {
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleThemeChange = (newTheme: AppThemeSetting) => {
    onUpdateSettings({ theme: newTheme });
  };

  const handleToggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  };

  const handleToggleReminder = (
    key: 'reminderWaterTest' | 'reminderWeeklyMaint' | 'reminderChemicals'
  ) => {
    onUpdateSettings({ [key]: !settings[key] });
  };

  const themeOptions: {
    id: AppThemeSetting;
    label: string;
    description: string;
    icon: React.FC<{ size?: number; className?: string }>;
  }[] = [
    { id: 'light', label: 'Svijetla', description: 'Standardna svijetla tema', icon: Sun },
    { id: 'dark', label: 'Tamna', description: 'Optimizovano za noć i tamne ekrane', icon: Moon },
    { id: 'system', label: 'Prati postavke uređaja', description: 'Automatski se prilagođava sistemu', icon: Laptop },
  ];

  const currentThemeLabel =
    settings.theme === 'light' ? 'Svijetla' : settings.theme === 'dark' ? 'Tamna' : 'Prati sistem';

  return (
    <div className="w-full flex flex-col min-h-full pb-14 select-none bg-slate-50/50 dark:bg-slate-900 transition-colors">
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-4 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button id="btn-settings-back" type="button" onClick={onBackToHome} className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 transition-colors focus:outline-none cursor-pointer" aria-label="Nazad">
              <ArrowLeft size={20} strokeWidth={2.4} />
            </button>
          )}
          <h1 className="text-lg font-black text-[#0F172A] dark:text-white tracking-tight">Podešavanja</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3.5 max-w-lg mx-auto w-full">
        <div id="card-settings-appearance" className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-all overflow-hidden">
          <button id="btn-toggle-appearance-group" type="button" onClick={() => setIsAppearanceOpen((prev) => !prev)} className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-750/50 transition-colors focus:outline-none" aria-expanded={isAppearanceOpen}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center flex-shrink-0"><Palette size={20} strokeWidth={2.2} /></div>
              <div><h2 className="text-base font-black text-[#0F172A] dark:text-white tracking-tight">Izgled aplikacije</h2><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tema: <span className="text-[#0062E3] dark:text-blue-400 font-bold">{currentThemeLabel}</span></p></div>
            </div>
            <ChevronDown size={20} strokeWidth={2.4} className={`text-slate-400 dark:text-slate-500 transform transition-transform duration-200 ${isAppearanceOpen ? 'rotate-180 text-[#0062E3] dark:text-blue-400' : ''}`} />
          </button>
          {isAppearanceOpen && (
            <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-700/60 space-y-2.5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">Odaberite temu aplikacije:</p>
              <div className="grid grid-cols-1 gap-2.5">
                {themeOptions.map((opt) => {
                  const isSelected = settings.theme === opt.id;
                  const IconComp = opt.icon;
                  return (
                    <button key={opt.id} id={`btn-theme-${opt.id}`} type="button" onClick={() => handleThemeChange(opt.id)} className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${isSelected ? 'border-[#0062E3] bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-2xs' : 'border-slate-200/80 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-[#0062E3] text-white shadow-2xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}><IconComp size={18} strokeWidth={2.2} /></div>
                        <div><div className="flex items-center gap-2"><span className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-white">{opt.label}</span>{opt.id === 'system' && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">Preporučeno</span>}</div><p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{opt.description}</p></div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${isSelected ? 'border-[#0062E3] bg-[#0062E3] text-white' : 'border-slate-300 dark:border-slate-600 bg-transparent'}`}>{isSelected && <Check size={12} strokeWidth={3} />}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div id="card-settings-notifications" className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-all overflow-hidden">
          <button id="btn-toggle-notifications-group" type="button" onClick={() => setIsNotificationsOpen((prev) => !prev)} className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-750/50 transition-colors focus:outline-none" aria-expanded={isNotificationsOpen}>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center flex-shrink-0"><Bell size={20} strokeWidth={2.2} /></div><div><h2 className="text-base font-black text-[#0F172A] dark:text-white tracking-tight">Obavijesti</h2><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{settings.notificationsEnabled ? 'Uključene' : 'Isključene'}</p></div></div>
            <div className="flex items-center gap-2.5"><span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${settings.notificationsEnabled ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>{settings.notificationsEnabled ? 'UKLJUČENO' : 'ISKLJUČENO'}</span><ChevronDown size={20} strokeWidth={2.4} className={`text-slate-400 dark:text-slate-500 transform transition-transform duration-200 ${isNotificationsOpen ? 'rotate-180 text-[#0062E3] dark:text-blue-400' : ''}`} /></div>
          </button>
          {isNotificationsOpen && (
            <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-750/70 border border-slate-200/80 dark:border-slate-700/60"><div><p className="text-xs font-extrabold text-[#0F172A] dark:text-white">Glavni prekidač obavijesti</p><p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Omogući ili onemogući sve podsjetnike</p></div><button id="toggle-master-notifications" type="button" onClick={handleToggleNotifications} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.notificationsEnabled ? 'bg-[#0062E3]' : 'bg-slate-300 dark:bg-slate-600'}`} aria-pressed={settings.notificationsEnabled} aria-label="Uključi ili isključi obavijesti"><span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} /></button></div>
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden">
                <button id="btn-toggle-reminders-subgroup" type="button" onClick={() => setIsRemindersOpen((prev) => !prev)} className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer bg-slate-50/60 dark:bg-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-750 transition-colors focus:outline-none" aria-expanded={isRemindersOpen}><div><h3 className="text-xs font-black text-[#0F172A] dark:text-white tracking-wide uppercase">Podsjetnici za održavanje</h3><p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pojedinačne opcije podsjetnika</p></div><ChevronDown size={18} strokeWidth={2.4} className={`text-slate-400 dark:text-slate-500 transform transition-transform duration-200 ${isRemindersOpen ? 'rotate-180 text-[#0062E3] dark:text-blue-400' : ''}`} /></button>
                {isRemindersOpen && (
                  <div className="p-3 bg-white dark:bg-slate-800/80 border-t border-slate-200/80 dark:border-slate-700/60 space-y-2">
                    <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${settings.notificationsEnabled ? 'bg-slate-50/70 dark:bg-slate-750/60 border-slate-200/80 dark:border-slate-700/60' : 'bg-slate-50/30 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-50'}`}><div className="pr-3"><p className="text-xs font-extrabold text-[#0F172A] dark:text-white">Testiranje vode</p><p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Preporučeni interval testiranja (svaka 2–3 dana)</p></div><button id="toggle-reminder-water-test" type="button" disabled={!settings.notificationsEnabled} onClick={() => handleToggleReminder('reminderWaterTest')} className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.reminderWaterTest && settings.notificationsEnabled ? 'bg-[#0062E3]' : 'bg-slate-300 dark:bg-slate-600'}`} aria-label="Podsjetnik za testiranje vode"><span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.reminderWaterTest && settings.notificationsEnabled ? 'translate-x-4' : 'translate-x-0'}`} /></button></div>
                    <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${settings.notificationsEnabled ? 'bg-slate-50/70 dark:bg-slate-750/60 border-slate-200/80 dark:border-slate-700/60' : 'bg-slate-50/30 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-50'}`}><div className="pr-3"><p className="text-xs font-extrabold text-[#0F172A] dark:text-white">Sedmično održavanje</p><p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Algicid, flokulant i pranje filtera</p></div><button id="toggle-reminder-weekly-maint" type="button" disabled={!settings.notificationsEnabled} onClick={() => handleToggleReminder('reminderWeeklyMaint')} className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.reminderWeeklyMaint && settings.notificationsEnabled ? 'bg-[#0062E3]' : 'bg-slate-300 dark:bg-slate-600'}`} aria-label="Podsjetnik za sedmično održavanje"><span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.reminderWeeklyMaint && settings.notificationsEnabled ? 'translate-x-4' : 'translate-x-0'}`} /></button></div>
                    <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${settings.notificationsEnabled ? 'bg-slate-50/70 dark:bg-slate-750/60 border-slate-200/80 dark:border-slate-700/60' : 'bg-slate-50/30 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-50'}`}><div className="pr-3"><p className="text-xs font-extrabold text-[#0F172A] dark:text-white">Podsjetnik za dodavanje sredstava</p><p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Tablete za sporo otapanje i korekcija pH/hlora</p></div><button id="toggle-reminder-chemicals" type="button" disabled={!settings.notificationsEnabled} onClick={() => handleToggleReminder('reminderChemicals')} className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.reminderChemicals && settings.notificationsEnabled ? 'bg-[#0062E3]' : 'bg-slate-300 dark:bg-slate-600'}`} aria-label="Podsjetnik za dodavanje sredstava"><span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.reminderChemicals && settings.notificationsEnabled ? 'translate-x-4' : 'translate-x-0'}`} /></button></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div id="card-settings-about" className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-all overflow-hidden">
          <button id="btn-toggle-about-group" type="button" onClick={() => setIsAboutOpen((prev) => !prev)} className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-750/50 transition-colors focus:outline-none" aria-expanded={isAboutOpen}>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center flex-shrink-0"><Info size={20} strokeWidth={2.2} /></div><div><h2 className="text-base font-black text-[#0F172A] dark:text-white tracking-tight">O aplikaciji</h2><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verzija 1.0.0 • Informacije</p></div></div>
            <ChevronDown size={20} strokeWidth={2.4} className={`text-slate-400 dark:text-slate-500 transform transition-transform duration-200 ${isAboutOpen ? 'rotate-180 text-[#0062E3] dark:text-blue-400' : ''}`} />
          </button>
          {isAboutOpen && (
            <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-4">
              <div className="flex flex-col items-center text-center py-2"><Logo size="lg" layout="vertical" /><p className="text-xs font-extrabold text-[#0062E3] dark:text-blue-400 mt-2.5 tracking-wide">„Tačne količine. Čista voda. Jednostavno.“</p><div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/80 rounded-full border border-slate-200/80 dark:border-slate-600"><ShieldCheck size={13} className="text-[#0062E3] dark:text-blue-400" /><span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200">Verzija 1.0.0</span></div></div>
              <div className="bg-slate-50/80 dark:bg-slate-750/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2.5"><p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">BAZEN – Kalkulator hemije je aplikacija namijenjena jednostavnom praćenju stanja bazenske vode i izračunu potrebnih količina sredstava za njeno održavanje.</p><p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Aplikacija omogućava evidenciju bazena, proizvoda za održavanje, rezultata testiranja vode i automatski proračun potrebnih količina prema podacima korisnika.</p></div>
              <div className="flex items-center justify-between px-4 py-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/40"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-xl bg-[#0062E3] text-white flex items-center justify-center shadow-2xs"><User size={15} strokeWidth={2.4} /></div><span className="text-xs font-bold text-slate-600 dark:text-slate-300">Autor</span></div><span className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-white">Adnan Hasanhodžić</span></div>

              {/* PROFESIONALNO ODRŽAVANJE BAZENA */}
              <a href="https://www.youtube.com/@PoolBoyTuzla" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 px-4 py-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/40 hover:bg-blue-100/70 dark:hover:bg-blue-950/50 active:bg-blue-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#0062E3] text-white flex items-center justify-center shadow-2xs flex-shrink-0"><ExternalLink size={15} strokeWidth={2.4} /></div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-[#0F172A] dark:text-white">Profesionalno održavanje bazena</p>
                    <p className="text-[11px] text-[#0062E3] dark:text-blue-400 font-bold truncate">Tuzla i okolina • PoolBoyTuzla</p>
                  </div>
                </div>
                <ExternalLink size={15} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
              </a>

              <div id="card-settings-disclaimer" className="p-3.5 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/40 flex items-start gap-3"><div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5"><AlertTriangle size={15} strokeWidth={2.4} /></div><div className="space-y-0.5"><h4 className="text-[11px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide">Napomena</h4><p className="text-[11px] text-amber-800/90 dark:text-amber-200/90 leading-relaxed font-medium">Proračuni su informativnog karaktera i zasnivaju se na podacima i doziranju koje je unio korisnik. Uvijek provjerite deklaraciju proizvoda i preporuke proizvođača.</p></div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
