import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical' | 'icon-only';
  showSubtitle?: boolean;
  className?: string;
}

/**
 * Official Bazen - Kalkulator Hemije Droplet Icon
 * Exactly matching the locked official brand asset.
 */
export const DropLogoIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-xs ${className}`}
      aria-label="Bazen Logo Ikona"
    >
      <defs>
        {/* Main Droplet Blue Gradient */}
        <linearGradient id="bazenDropGrad" x1="50" y1="4" x2="50" y2="106" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="35%" stopColor="#1D4ED8" />
          <stop offset="70%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>

        {/* Lower Water Wave Gradient */}
        <linearGradient id="bazenWaveGrad" x1="50" y1="60" x2="50" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Droplet Clip Path */}
        <clipPath id="bazenDropClip">
          <path d="M50 4 C50 4 94 54 94 80 C94 98 74.3 108 50 108 C25.7 108 6 98 6 80 C6 54 50 4 50 4 Z" />
        </clipPath>
      </defs>

      {/* 1. Main Droplet Base */}
      <path
        d="M50 4 C50 4 94 54 94 80 C94 98 74.3 108 50 108 C25.7 108 6 98 6 80 C6 54 50 4 50 4 Z"
        fill="url(#bazenDropGrad)"
      />

      {/* 2. Droplet Inner Elements (Clipped) */}
      <g clipPath="url(#bazenDropClip)">
        {/* Lower water fill */}
        <path
          d="M0 66 Q 25 58, 50 66 T 100 66 L 100 110 L 0 110 Z"
          fill="url(#bazenWaveGrad)"
          opacity="0.9"
        />

        {/* Top Wave Line (White) */}
        <path
          d="M -5 66 Q 22 57, 50 66 T 105 66"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Second Wave Line (White) */}
        <path
          d="M -5 82 Q 22 73, 50 82 T 105 82"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Subtle Third Wave/Floor Line */}
        <path
          d="M -5 95 Q 22 89, 50 95 T 105 95"
          stroke="#93C5FD"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Top-Left Gloss Highlight */}
        <path
          d="M 46 16 C 46 16 26 44 24 58 C 22 47 30 28 42 18 Z"
          fill="#FFFFFF"
          opacity="0.55"
        />
        {/* Soft Specular Dot */}
        <circle cx="22" cy="62" r="3" fill="#FFFFFF" opacity="0.7" />
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  layout = 'horizontal',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 32,
    md: 38,
    lg: 54,
    xl: 72,
  };

  const titleSizes = {
    sm: 'text-[17px] font-black tracking-tight',
    md: 'text-xl font-black tracking-tight',
    lg: 'text-3xl font-black tracking-tight',
    xl: 'text-4xl sm:text-5xl font-black tracking-tight',
  };

  const subtitleSizes = {
    sm: 'text-[8.5px] tracking-[0.14em] font-extrabold',
    md: 'text-[10px] tracking-[0.16em] font-extrabold',
    lg: 'text-xs tracking-[0.18em] font-extrabold',
    xl: 'text-sm sm:text-base tracking-[0.2em] font-extrabold',
  };

  if (layout === 'icon-only') {
    return <DropLogoIcon size={iconSizes[size]} className={className} />;
  }

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <DropLogoIcon size={iconSizes[size]} className="mb-2" />
        <h1 className={`text-[#0047BA] dark:text-[#3B82F6] leading-none ${titleSizes[size]}`}>
          BAZEN
        </h1>
        {showSubtitle && (
          <p className={`text-[#0F172A] dark:text-slate-200 mt-1.5 uppercase ${subtitleSizes[size]}`}>
            KALKULATOR HEMIJE
          </p>
        )}
      </div>
    );
  }

  // Horizontal layout (Header)
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <DropLogoIcon size={iconSizes[size]} />
      <div className="flex flex-col text-left">
        <span className={`text-[#0047BA] dark:text-[#3B82F6] leading-none font-black ${titleSizes[size]}`}>
          BAZEN
        </span>
        {showSubtitle && (
          <span className={`text-[#0F172A] dark:text-slate-200 uppercase mt-0.5 leading-none ${subtitleSizes[size]}`}>
            KALKULATOR HEMIJE
          </span>
        )}
      </div>
    </div>
  );
};

