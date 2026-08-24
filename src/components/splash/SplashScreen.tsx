import React, { useEffect } from 'react';
import { Logo } from '../common/Logo';
import { PoolIllustration } from '../common/PoolIllustration';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [onFinish, durationMs]);

  return (
    <div
      id="splash-screen-container"
      className="relative w-full h-full min-h-[640px] flex flex-col justify-between bg-gradient-to-b from-white via-[#F4F9FF] to-[#E5F1FD] select-none overflow-hidden pt-6"
    >
      {/* Main Splash Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-4 pb-2 z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <Logo size="xl" layout="vertical" showSubtitle={true} />

          {/* Slogan Divider */}
          <div className="w-40 h-[1.5px] bg-[#93C5FD]/80 my-3 rounded-full" />

          {/* Slogan Text */}
          <p className="text-slate-600 font-medium text-sm text-center tracking-tight">
            Tačne količine. Čista voda.<br />Jednostavno.
          </p>
        </div>

        {/* Pool Illustration */}
        <div className="w-full max-w-[320px] my-2 transition-all transform duration-700 ease-out">
          <PoolIllustration variant="splash" />
        </div>
      </div>

      {/* Bottom Loading Section */}
      <div className="w-full flex flex-col items-center justify-center pb-12 pt-2 z-10">
        {/* Animated Droplet Arc Spinner */}
        <div className="relative flex flex-col items-center justify-center mb-3">
          {/* Subtle droplet in center */}
          <div className="mb-1">
            <svg width="22" height="26" viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M50 6 C50 6 92 56 92 82 C92 100.5 73.2 112 50 112 C26.8 112 8 100.5 8 82 C8 56 50 6 50 6 Z"
                fill="#0062E3"
              />
            </svg>
          </div>

          {/* Arc spinner */}
          <div className="w-11 h-6 overflow-hidden flex items-start justify-center -mt-1">
            <div className="w-10 h-10 rounded-full border-2 border-transparent border-b-[#0062E3] border-l-[#0062E3] animate-pulse" />
          </div>
        </div>

        <p className="text-[#0062E3] font-bold text-sm tracking-wide">
          Učitavanje...
        </p>
      </div>

      {/* Background ambient lighting */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
