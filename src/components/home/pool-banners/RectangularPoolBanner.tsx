import React from 'react';

/**
 * Exact Illustrative Middle Pool Graphic: PRAVOUGAONI BAZEN (Rectangular Pool)
 * - Light sky blue illustrative background arch with soft clouds
 * - Stylized line-art botanical plants and leaves on left and right
 * - In-ground rectangular swimming pool with stone coping slabs in perspective
 * - Tiled inner pool walls and floor with blue depth
 * - Stainless steel swimming pool ladder / handrail on the left corner
 * - Shimmering crystal blue water with perspective ripples and wave lines
 * - Light patio paving lines
 */
export const RectangularPoolBanner: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-label="Ilustracija pravougaonog bazena"
    >
      <defs>
        {/* Soft Sky Background Gradient */}
        <linearGradient id="illuRectSky" x1="200" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="40%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>

        {/* Soft Background Arch */}
        <linearGradient id="illuRectArch" x1="200" y1="20" x2="200" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#CFE4FC" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#D9ECFE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#E8F4FE" stopOpacity="0.1" />
        </linearGradient>

        {/* Pool Water Surface Gradient */}
        <linearGradient id="illuRectWater" x1="200" y1="95" x2="200" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="35%" stopColor="#0EA5E9" />
          <stop offset="75%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>

        {/* Deep Pool Walls Gradient */}
        <linearGradient id="illuRectWalls" x1="200" y1="95" x2="200" y2="215" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00438F" />
          <stop offset="60%" stopColor="#0264B8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Coping Stone Border Gradient */}
        <linearGradient id="illuRectCoping" x1="200" y1="90" x2="200" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#F1F5F9" />
          <stop offset="80%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Soft Ground Shadow / Wash */}
        <radialGradient id="illuRectGround" cx="200" cy="215" r="185" fx="200" fy="215" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.75" />
          <stop offset="65%" stopColor="#E0F2FE" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0" />
        </radialGradient>

        {/* Water Ripple Caustics Pattern */}
        <pattern id="illuRectCaustics" width="36" height="18" patternUnits="userSpaceOnUse">
          <path
            d="M 0 9 Q 9 2 18 9 T 36 9"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.9"
            opacity="0.6"
          />
          <path
            d="M 0 4 Q 9 11 18 4 T 36 4"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="0.7"
            opacity="0.4"
          />
        </pattern>

        <clipPath id="illuRectWaterClip">
          <polygon points="56,206 344,206 308,98 92,98" />
        </clipPath>
      </defs>

      {/* 1. Base Sky Fill */}
      <rect width="400" height="240" fill="url(#illuRectSky)" />

      {/* 2. Soft Illustrative Central Arch Backdrop */}
      <path
        d="M 60 230 C 60 70, 100 25, 200 25 C 300 25, 340 70, 340 230 Z"
        fill="url(#illuRectArch)"
      />

      {/* 3. Soft Background Clouds */}
      <g opacity="0.65" fill="#FFFFFF">
        {/* Left Cloud */}
        <path d="M 90 82 C 90 72 105 67 117 72 C 125 63 143 63 151 72 C 159 67 173 75 170 85 C 175 91 167 99 159 97 C 151 103 135 103 127 97 C 119 100 105 95 105 89 Z" />
        {/* Right Cloud */}
        <path d="M 250 75 C 250 65 265 61 277 65 C 285 57 303 57 311 65 C 319 61 331 69 327 79 C 333 85 325 93 317 91 C 309 97 293 97 285 91 C 275 93 263 89 263 82 Z" />
      </g>

      {/* 4. Stylized Botanical Line Art Foliage (Left Side) */}
      <g stroke="#3B82F6" strokeWidth="1.2" fill="none" opacity="0.75">
        {/* Main Branch Left */}
        <path d="M 50 190 Q 35 138 65 96" strokeWidth="1.5" />
        <path d="M 65 96 C 52 86 38 99 52 112 C 58 104 65 96 65 96 Z" fill="#93C5FD" fillOpacity="0.4" />
        <path d="M 54 122 C 40 116 34 130 46 137 C 51 131 54 122 54 122 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 58 148 C 44 144 40 157 52 161 C 56 155 58 148 58 148 Z" fill="#93C5FD" fillOpacity="0.35" />

        {/* Outer Bush Left */}
        <path d="M 30 200 Q 18 158 38 126" strokeWidth="1.3" />
        <path d="M 38 126 C 28 118 20 128 30 137 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 28 154 C 18 148 12 158 22 164 Z" fill="#93C5FD" fillOpacity="0.4" />
      </g>

      {/* 5. Stylized Botanical Line Art Foliage (Right Side) */}
      <g stroke="#3B82F6" strokeWidth="1.2" fill="none" opacity="0.75">
        {/* Main Branch Right */}
        <path d="M 350 190 Q 365 138 335 96" strokeWidth="1.5" />
        <path d="M 335 96 C 348 86 362 99 348 112 C 342 104 335 96 335 96 Z" fill="#93C5FD" fillOpacity="0.4" />
        <path d="M 346 122 C 360 116 366 130 354 137 C 349 131 346 122 346 122 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 342 148 C 356 144 360 157 348 161 C 344 155 342 148 342 148 Z" fill="#93C5FD" fillOpacity="0.35" />

        {/* Outer Bush Right */}
        <path d="M 370 200 Q 382 158 362 126" strokeWidth="1.3" />
        <path d="M 362 126 C 372 118 380 128 370 137 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 372 154 C 382 148 388 158 378 164 Z" fill="#93C5FD" fillOpacity="0.4" />
      </g>

      {/* 6. Soft Ground Wash */}
      <ellipse cx="200" cy="214" rx="175" ry="24" fill="url(#illuRectGround)" />

      {/* 7. Light Perspective Ground Paving Lines */}
      <g stroke="#93C5FD" strokeWidth="0.8" opacity="0.4" strokeDasharray="3 3">
        <line x1="20" y1="218" x2="380" y2="218" />
        <line x1="45" y1="95" x2="15" y2="230" />
        <line x1="355" y1="95" x2="385" y2="230" />
      </g>

      {/* 8. RECTANGULAR IN-GROUND POOL BASIN */}
      {/* Outer Coping Stone Border Around Pool (Perspective Frame) */}
      <polygon
        points="46,214 354,214 316,92 84,92"
        fill="url(#illuRectCoping)"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />

      {/* Coping Stone Joint Lines (Slabs) */}
      <g stroke="#94A3B8" strokeWidth="1" opacity="0.6">
        {/* Front Edge Slabs */}
        <line x1="108" y1="206" x2="108" y2="214" />
        <line x1="170" y1="206" x2="170" y2="214" />
        <line x1="230" y1="206" x2="230" y2="214" />
        <line x1="292" y1="206" x2="292" y2="214" />
        {/* Left Edge Slabs */}
        <line x1="84" y1="92" x2="56" y2="206" />
        <line x1="88" y1="120" x2="74" y2="122" />
        <line x1="82" y1="150" x2="68" y2="153" />
        <line x1="75" y1="180" x2="60" y2="183" />
        {/* Right Edge Slabs */}
        <line x1="316" y1="92" x2="344" y2="206" />
        <line x1="312" y1="120" x2="326" y2="122" />
        <line x1="318" y1="150" x2="332" y2="153" />
        <line x1="325" y1="180" x2="340" y2="183" />
        {/* Back Edge Slabs */}
        <line x1="130" y1="92" x2="130" y2="98" />
        <line x1="180" y1="92" x2="180" y2="98" />
        <line x1="230" y1="92" x2="230" y2="98" />
        <line x1="280" y1="92" x2="280" y2="98" />
      </g>

      {/* Inner Pool Rim Border */}
      <polygon
        points="56,206 344,206 308,98 92,98"
        fill="#00438F"
        stroke="#0284C7"
        strokeWidth="1.2"
      />

      {/* Inside Basin Walls with Depth */}
      <g clipPath="url(#illuRectWaterClip)">
        {/* Deep Pool Water Bed Fill */}
        <rect x="40" y="90" width="320" height="125" fill="url(#illuRectWater)" />

        {/* Back Wall Depth */}
        <polygon points="92,98 308,98 308,114 92,114" fill="url(#illuRectWalls)" opacity="0.9" />
        {/* Left Wall Depth */}
        <polygon points="92,98 92,114 56,206 56,190" fill="url(#illuRectWalls)" opacity="0.75" />

        {/* Perspective Water Caustics Overlay */}
        <rect x="40" y="90" width="320" height="125" fill="url(#illuRectCaustics)" />

        {/* Shimmering Water Waves & Ripple Lines */}
        <g stroke="#FFFFFF" fill="none" opacity="0.85" strokeLinecap="round">
          {/* Horizontal Wave Lines */}
          <path d="M 68 198 Q 135 190 200 198 T 332 198" strokeWidth="2.2" />
          <path d="M 78 175 Q 140 168 200 175 T 322 175" strokeWidth="1.8" opacity="0.8" />
          <path d="M 88 152 Q 145 146 200 152 T 312 152" strokeWidth="1.6" opacity="0.75" />
          <path d="M 98 130 Q 150 125 200 130 T 302 130" strokeWidth="1.4" opacity="0.7" />
          <path d="M 108 110 Q 155 106 200 110 T 292 110" strokeWidth="1.2" opacity="0.65" />
        </g>

        {/* Submerged Perspective Grid Lines (Underwater Floor Tiles) */}
        <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.8">
          <line x1="120" y1="98" x2="95" y2="206" />
          <line x1="160" y1="98" x2="148" y2="206" />
          <line x1="200" y1="98" x2="200" y2="206" />
          <line x1="240" y1="98" x2="252" y2="206" />
          <line x1="280" y1="98" x2="305" y2="206" />
        </g>

        {/* Specular White Highlights on Water */}
        <polygon points="102,100 230,100 220,104 110,104" fill="#FFFFFF" opacity="0.85" />
        <line x1="72" y1="206" x2="210" y2="206" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        <line x1="230" y1="206" x2="330" y2="206" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
      </g>

      {/* 9. Stainless Steel Pool Ladder on the Left Corner (from GUI reference) */}
      <g id="rect-pool-ladder-vector">
        {/* Left Ladder Handrail */}
        <path
          d="M 68 185 L 68 120 C 68 102 79 102 79 120 L 79 145"
          stroke="#94A3B8"
          strokeWidth="3.6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 68 185 L 68 120 C 68 102 79 102 79 120 L 79 145"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right Ladder Handrail */}
        <path
          d="M 80 188 L 80 120 C 80 102 91 102 91 120 L 91 148"
          stroke="#94A3B8"
          strokeWidth="3.6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 80 188 L 80 120 C 80 102 91 102 91 120 L 91 148"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Ladder Steps / Rungs */}
        <line x1="68" y1="135" x2="80" y2="135" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="150" x2="80" y2="150" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="165" x2="80" y2="165" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Deck mounting flanges */}
        <ellipse cx="68" cy="186" rx="4" ry="2" fill="#334155" />
        <ellipse cx="80" cy="189" rx="4" ry="2" fill="#334155" />
      </g>
    </svg>
  );
};

