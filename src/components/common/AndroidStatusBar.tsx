import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface AndroidStatusBarProps {
  theme?: 'dark' | 'light' | 'primary-blue';
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ theme = 'light' }) => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const colorClass =
    theme === 'primary-blue'
      ? 'text-[#005FEA]'
      : theme === 'dark'
      ? 'text-white'
      : 'text-[#0F172A]';

  return (
    <div className={`w-full px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold select-none ${colorClass}`}>
      <span className="font-bold tracking-tight text-[13px]">{timeStr}</span>
      <div className="flex items-center gap-1.5 opacity-90">
        <Wifi size={14} strokeWidth={2.5} />
        {/* Cellular 4-bar indicator */}
        <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor" className="inline-block">
          <rect x="0" y="9" width="2" height="3" rx="0.5" />
          <rect x="3.5" y="6" width="2" height="6" rx="0.5" />
          <rect x="7" y="3" width="2" height="9" rx="0.5" />
          <rect x="10.5" y="0" width="2" height="12" rx="0.5" />
        </svg>
        <Battery size={15} strokeWidth={2.5} className="fill-current" />
      </div>
    </div>
  );
};
