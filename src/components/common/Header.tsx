import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenNotifications,
  unreadNotificationsCount = 1,
}) => {
  return (
    <header className="w-full px-5 py-3 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 transition-colors">
      {/* Left: Hamburger menu */}
      <button
        id="btn-hamburger-menu"
        type="button"
        onClick={onOpenMenu}
        className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        aria-label="Glavni meni"
      >
        <Menu size={22} strokeWidth={2.2} />
      </button>

      {/* Center: Official Logo Asset */}
      <div className="flex items-center justify-center">
        <Logo size="sm" layout="horizontal" />
      </div>

      {/* Right: Notifications */}
      <button
        id="btn-notifications"
        type="button"
        onClick={onOpenNotifications}
        className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        aria-label="Obavijesti"
      >
        <Bell size={21} strokeWidth={2.2} />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#0062E3] rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
        )}
      </button>
    </header>
  );
};
