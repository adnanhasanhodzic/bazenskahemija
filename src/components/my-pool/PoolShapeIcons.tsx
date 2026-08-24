import React from 'react';

export const RoundPoolIcon: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = '' }) => {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 120 78" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="roundWater" x1="60" y1="8" x2="60" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00A2FF" />
          <stop offset="100%" stopColor="#0072E8" />
        </linearGradient>
        <linearGradient id="roundWall" x1="60" y1="20" x2="60" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0080FF" />
        </linearGradient>
      </defs>
      
      {/* Outer cylinder wall */}
      <path
        d="M10 24 C10 24 10 52 10 56 C10 68 32 76 60 76 C88 76 110 68 110 56 C110 52 110 24 110 24 Z"
        fill="url(#roundWall)"
        stroke="#0056C6"
        strokeWidth="2"
      />
      
      {/* Top water surface rim ellipse */}
      <ellipse
        cx="60"
        cy="24"
        rx="50"
        ry="18"
        fill="url(#roundWater)"
        stroke="#0056C6"
        strokeWidth="2.5"
      />
      
      {/* Inner water reflection ellipse */}
      <ellipse
        cx="60"
        cy="25"
        rx="40"
        ry="13"
        fill="none"
        stroke="#7DD3FC"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
};

export const RectangularPoolIcon: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = '' }) => {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 120 78" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="rectWater" x1="60" y1="12" x2="60" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00A2FF" />
          <stop offset="100%" stopColor="#0072E8" />
        </linearGradient>
        <linearGradient id="rectWall" x1="60" y1="30" x2="60" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0080FF" />
        </linearGradient>
      </defs>

      {/* Outer 3D block front and bottom */}
      <path
        d="M10 38 L28 20 L92 20 L110 38 L110 54 L92 70 L28 70 L10 54 Z"
        fill="none"
      />
      
      {/* Left Wall */}
      <path
        d="M10 38 L28 20 L28 36 L10 54 Z"
        fill="#0284C7"
        stroke="#0056C6"
        strokeWidth="2"
      />

      {/* Front Wall */}
      <path
        d="M10 38 L110 38 L110 54 L10 54 Z"
        fill="url(#rectWall)"
        stroke="#0056C6"
        strokeWidth="2"
      />

      {/* Right Wall */}
      <path
        d="M110 38 L92 20 L92 36 L110 54 Z"
        fill="#0369A1"
        stroke="#0056C6"
        strokeWidth="2"
      />

      {/* Top Water Surface */}
      <polygon
        points="10,38 28,20 92,20 110,38"
        fill="url(#rectWater)"
        stroke="#0056C6"
        strokeWidth="2"
      />

      {/* Top inner water gloss */}
      <polygon
        points="18,36 32,24 88,24 102,36"
        fill="none"
        stroke="#7DD3FC"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
};

export const OvalPoolIcon: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = '' }) => {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 120 78" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="ovalWater" x1="60" y1="12" x2="60" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00A2FF" />
          <stop offset="100%" stopColor="#0072E8" />
        </linearGradient>
        <linearGradient id="ovalWall" x1="60" y1="20" x2="60" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0080FF" />
        </linearGradient>
      </defs>

      {/* Outer oval cylinder wall */}
      <path
        d="M8 26 C8 26 8 48 8 52 C8 66 32 72 60 72 C88 72 112 66 112 52 C112 48 112 26 112 26 Z"
        fill="url(#ovalWall)"
        stroke="#0056C6"
        strokeWidth="2"
      />

      {/* Top elongated oval surface */}
      <path
        d="M32 14 L88 14 C101 14 112 20 112 28 C112 36 101 42 88 42 L32 42 C19 42 8 36 8 28 C8 20 19 14 32 14 Z"
        fill="url(#ovalWater)"
        stroke="#0056C6"
        strokeWidth="2.5"
      />

      {/* Inner water reflection */}
      <path
        d="M34 18 L86 18 C96 18 104 22 104 28 C104 34 96 38 86 38 L34 38 C24 38 16 34 16 28 C16 22 24 18 34 18 Z"
        fill="none"
        stroke="#7DD3FC"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
};
