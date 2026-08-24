import React from 'react';

/**
 * Exact Illustrative Left Pool Graphic: OKRUGLI BAZEN (Round Pool)
 * - Light sky blue illustrative background arch with soft clouds
 * - Stylized line-art botanical plants and leaves on left and right
 * - Round above-ground steel frame pool with vertical legs and feet pads
 * - Round top rail in white with connection joints
 * - Light liner body with inner blue mosaic rim
 * - Shimmering crystal blue water with ripples
 * - Silver pool ladder on the left
 * - Water splash droplets in the air
 */
export const RoundPoolBanner: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-label="Ilustracija okruglog bazena"
    >
      <defs>
        {/* Soft Sky Background Gradient */}
        <linearGradient id="illuRoundSky" x1="200" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="40%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>

        {/* Soft Background Arch */}
        <linearGradient id="illuRoundArch" x1="200" y1="20" x2="200" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#CFE4FC" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#D9ECFE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#E8F4FE" stopOpacity="0.1" />
        </linearGradient>

        {/* Water Gradient */}
        <linearGradient id="illuRoundWater" x1="200" y1="100" x2="200" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0080FF" />
          <stop offset="45%" stopColor="#0096FF" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Inner Mosaic Wall Gradient */}
        <linearGradient id="illuRoundMosaic" x1="200" y1="80" x2="200" y2="135" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0256B8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Outer Cylinder Liner Body Gradient */}
        <linearGradient id="illuRoundLiner" x1="200" y1="120" x2="200" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#F1F5F9" />
          <stop offset="75%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Soft Ground Shadow Puddle */}
        <radialGradient id="illuRoundPuddle" cx="200" cy="218" r="180" fx="200" fy="218" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.8" />
          <stop offset="65%" stopColor="#E0F2FE" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0" />
        </radialGradient>

        {/* Inner Mosaic Tile Pattern */}
        <pattern id="illuRoundTilePattern" width="10" height="6" patternUnits="userSpaceOnUse">
          <rect width="10" height="6" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
        </pattern>

        <clipPath id="illuRoundInnerClip">
          <ellipse cx="200" cy="118" rx="146" ry="34" />
        </clipPath>
      </defs>

      {/* 1. Base Sky Fill */}
      <rect width="400" height="240" fill="url(#illuRoundSky)" />

      {/* 2. Soft Illustrative Central Arch Backdrop */}
      <path
        d="M 60 230 C 60 70, 100 25, 200 25 C 300 25, 340 70, 340 230 Z"
        fill="url(#illuRoundArch)"
      />

      {/* 3. Soft Background Clouds */}
      <g opacity="0.65" fill="#FFFFFF">
        {/* Left Cloud */}
        <path d="M 85 85 C 85 75 100 70 112 75 C 120 66 138 66 146 75 C 154 70 168 78 165 88 C 170 94 162 102 154 100 C 146 106 130 106 122 100 C 114 103 100 98 100 92 Z" />
        {/* Right Cloud */}
        <path d="M 255 78 C 255 68 270 64 282 68 C 290 60 308 60 316 68 C 324 64 336 72 332 82 C 338 88 330 96 322 94 C 314 100 298 100 290 94 C 280 96 268 92 268 85 Z" />
      </g>

      {/* 4. Stylized Botanical Line Art Foliage (Left Side) */}
      <g stroke="#3B82F6" strokeWidth="1.2" fill="none" opacity="0.75">
        {/* Branch 1 */}
        <path d="M 55 195 Q 40 145 68 105" strokeWidth="1.5" />
        <path d="M 68 105 C 55 95 42 108 55 120 C 62 112 68 105 68 105 Z" fill="#93C5FD" fillOpacity="0.4" />
        <path d="M 58 130 C 45 125 38 138 50 145 C 55 140 58 130 58 130 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 62 155 C 48 152 44 164 56 168 C 60 162 62 155 62 155 Z" fill="#93C5FD" fillOpacity="0.35" />

        {/* Branch 2 (Outer) */}
        <path d="M 35 205 Q 22 165 42 135" strokeWidth="1.3" />
        <path d="M 42 135 C 32 128 24 138 34 146 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 32 162 C 22 156 16 166 26 172 Z" fill="#93C5FD" fillOpacity="0.4" />
      </g>

      {/* 5. Stylized Botanical Line Art Foliage (Right Side) */}
      <g stroke="#3B82F6" strokeWidth="1.2" fill="none" opacity="0.75">
        {/* Branch 1 */}
        <path d="M 345 195 Q 360 145 332 105" strokeWidth="1.5" />
        <path d="M 332 105 C 345 95 358 108 345 120 C 338 112 332 105 332 105 Z" fill="#93C5FD" fillOpacity="0.4" />
        <path d="M 342 130 C 355 125 362 138 350 145 C 345 140 342 130 342 130 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 338 155 C 352 152 356 164 344 168 C 340 162 338 155 338 155 Z" fill="#93C5FD" fillOpacity="0.35" />

        {/* Branch 2 (Outer) */}
        <path d="M 365 205 Q 378 165 358 135" strokeWidth="1.3" />
        <path d="M 358 135 C 368 128 376 138 366 146 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 368 162 C 378 156 384 166 374 172 Z" fill="#93C5FD" fillOpacity="0.4" />
      </g>

      {/* 6. Soft Ground Puddle / Shadow under pool */}
      <ellipse cx="200" cy="216" rx="168" ry="22" fill="url(#illuRoundPuddle)" />

      {/* 7. Water Droplet Splashes in Air (Left top area) */}
      <g fill="#38BDF8" opacity="0.85">
        <ellipse cx="118" cy="88" rx="2.5" ry="4.5" transform="rotate(-20 118 88)" />
        <ellipse cx="128" cy="80" rx="3" ry="5.5" transform="rotate(-10 128 80)" />
        <ellipse cx="140" cy="86" rx="2" ry="3.5" transform="rotate(15 140 86)" />
        <ellipse cx="148" cy="74" rx="2.5" ry="4" transform="rotate(25 148 74)" />
        <ellipse cx="108" cy="100" rx="2" ry="3" transform="rotate(-30 108 100)" />
      </g>

      {/* 8. ROUND POOL STRUCTURE */}
      {/* Pool Rear Rim / Back Wall */}
      <ellipse cx="200" cy="108" rx="150" ry="36" fill="#00438F" stroke="#CBD5E1" strokeWidth="1.5" />

      {/* Pool Interior - Mosaic Wall and Shimmering Water */}
      <g clipPath="url(#illuRoundInnerClip)">
        {/* Back Wall Mosaic */}
        <rect x="40" y="70" width="320" height="75" fill="url(#illuRoundMosaic)" />
        <rect x="40" y="70" width="320" height="75" fill="url(#illuRoundTilePattern)" />

        {/* Water Surface Oval */}
        <ellipse cx="200" cy="122" rx="146" ry="28" fill="url(#illuRoundWater)" />

        {/* Water Wave Curves and Ripples */}
        <g stroke="#FFFFFF" strokeLinecap="round" opacity="0.8">
          <path d="M 85 120 Q 140 112 200 120 T 315 120" strokeWidth="2.2" />
          <path d="M 110 128 Q 155 122 200 128 T 290 128" strokeWidth="1.8" opacity="0.75" />
          <path d="M 140 134 Q 170 130 200 134 T 260 134" strokeWidth="1.4" opacity="0.6" />
        </g>

        {/* Clear bottom pool tile lines underwater */}
        <g stroke="rgba(255,255,255,0.25)" strokeWidth="0.8">
          <line x1="90" y1="126" x2="310" y2="126" />
          <line x1="110" y1="135" x2="290" y2="135" />
          <line x1="130" y1="115" x2="120" y2="142" />
          <line x1="165" y1="115" x2="160" y2="142" />
          <line x1="200" y1="115" x2="200" y2="142" />
          <line x1="235" y1="115" x2="240" y2="142" />
          <line x1="270" y1="115" x2="280" y2="142" />
        </g>
      </g>

      {/* Main Round Pool PVC Liner Front Wall */}
      <path
        d="M 50 108 C 50 108, 50 175, 54 188 C 62 204, 116 218, 200 218 C 284 218, 338 204, 346 188 C 350 175, 350 108, 350 108 C 350 134, 282 152, 200 152 C 118 152, 50 134, 50 108 Z"
        fill="url(#illuRoundLiner)"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />

      {/* Vertical Structural Support Posts & Feet */}
      {/* Leg 1 (Far Left) */}
      <g>
        <line x1="88" y1="138" x2="84" y2="204" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="88" y1="138" x2="84" y2="204" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="84" cy="204" rx="5" ry="3" fill="#334155" />
        <circle cx="88" cy="138" r="3.5" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
      </g>

      {/* Leg 2 (Mid Left) */}
      <g>
        <line x1="140" y1="148" x2="138" y2="214" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="140" y1="148" x2="138" y2="214" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="138" cy="214" rx="5" ry="3" fill="#334155" />
        <circle cx="140" cy="148" r="3.5" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
      </g>

      {/* Leg 3 (Center) */}
      <g>
        <line x1="200" y1="152" x2="200" y2="218" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="200" y1="152" x2="200" y2="218" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="200" cy="218" rx="5.5" ry="3" fill="#334155" />
        <circle cx="200" cy="152" r="3.5" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
      </g>

      {/* Leg 4 (Mid Right) */}
      <g>
        <line x1="260" y1="148" x2="262" y2="214" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="260" y1="148" x2="262" y2="214" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="262" cy="214" rx="5" ry="3" fill="#334155" />
        <circle cx="260" cy="148" r="3.5" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
      </g>

      {/* Leg 5 (Far Right) */}
      <g>
        <line x1="312" y1="138" x2="316" y2="204" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="312" y1="138" x2="316" y2="204" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="316" cy="204" rx="5" ry="3" fill="#334155" />
        <circle cx="312" cy="138" r="3.5" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
      </g>

      {/* Round Top White Steel Rim Tube */}
      <path
        d="M 48 108 C 48 84, 116 66, 200 66 C 284 66, 352 84, 352 108 C 352 132, 284 150, 200 150 C 116 150, 48 132, 48 108 Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="6"
      />
      <path
        d="M 48 108 C 48 84, 116 66, 200 66 C 284 66, 352 84, 352 108 C 352 132, 284 150, 200 150 C 116 150, 48 132, 48 108 Z"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />

      {/* 9. Silver Pool Ladder on the Left (from GUI reference) */}
      <g id="round-pool-ladder-vector">
        {/* Left Ladder Handrail */}
        <path
          d="M 72 195 L 72 88 C 72 65, 86 65, 86 88 L 86 118"
          stroke="#94A3B8"
          strokeWidth="3.8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 72 195 L 72 88 C 72 65, 86 65, 86 88 L 86 118"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right Ladder Handrail */}
        <path
          d="M 88 198 L 88 88 C 88 65, 102 65, 102 88 L 102 120"
          stroke="#94A3B8"
          strokeWidth="3.8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 88 198 L 88 88 C 88 65, 102 65, 102 88 L 102 120"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Ladder Steps / Rungs */}
        <line x1="72" y1="108" x2="88" y2="108" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="72" y1="128" x2="88" y2="128" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="72" y1="148" x2="88" y2="148" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="72" y1="168" x2="88" y2="168" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" />

        {/* Ladder feet */}
        <rect x="68" y="193" width="8" height="4" rx="1.5" fill="#334155" />
        <rect x="84" y="196" width="8" height="4" rx="1.5" fill="#334155" />
      </g>
    </svg>
  );
};

