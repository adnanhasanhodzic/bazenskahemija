import React from 'react';

/**
 * Exact Illustrative Right Pool Graphic: OVALNI BAZEN (Oval Pool)
 * - Light sky blue illustrative background arch with soft clouds
 * - Stylized line-art botanical plants and leaves on left and right
 * - In-ground oval swimming pool with curved stone coping slabs
 * - Deep blue inner basin walls
 * - Stainless steel swimming pool ladder / curved handrail on the left curve
 * - Shimmering crystal blue water with concentric oval ripples and wave lines
 * - Light ground wash and perspective lines
 */
export const OvalPoolBanner: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-label="Ilustracija ovalnog bazena"
    >
      <defs>
        {/* Soft Sky Background Gradient */}
        <linearGradient id="illuOvalSky" x1="200" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="40%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>

        {/* Soft Background Arch */}
        <linearGradient id="illuOvalArch" x1="200" y1="20" x2="200" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#CFE4FC" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#D9ECFE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#E8F4FE" stopOpacity="0.1" />
        </linearGradient>

        {/* Pool Water Surface Gradient */}
        <linearGradient id="illuOvalWater" x1="200" y1="95" x2="200" y2="205" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="35%" stopColor="#0EA5E9" />
          <stop offset="75%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>

        {/* Deep Pool Inner Wall Gradient */}
        <linearGradient id="illuOvalWalls" x1="200" y1="90" x2="200" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#003B7E" />
          <stop offset="50%" stopColor="#025CA8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Coping Stone Rim Gradient */}
        <linearGradient id="illuOvalCoping" x1="200" y1="85" x2="200" y2="215" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#F1F5F9" />
          <stop offset="80%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Soft Ground Wash */}
        <radialGradient id="illuOvalGround" cx="200" cy="216" r="185" fx="200" fy="216" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.75" />
          <stop offset="65%" stopColor="#E0F2FE" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0" />
        </radialGradient>

        {/* Water Caustics Pattern */}
        <pattern id="illuOvalCaustics" width="36" height="18" patternUnits="userSpaceOnUse">
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

        <clipPath id="illuOvalWaterClip">
          <ellipse cx="200" cy="154" rx="146" ry="52" />
        </clipPath>
      </defs>

      {/* 1. Base Sky Fill */}
      <rect width="400" height="240" fill="url(#illuOvalSky)" />

      {/* 2. Soft Illustrative Central Arch Backdrop */}
      <path
        d="M 60 230 C 60 70, 100 25, 200 25 C 300 25, 340 70, 340 230 Z"
        fill="url(#illuOvalArch)"
      />

      {/* 3. Soft Background Clouds */}
      <g opacity="0.65" fill="#FFFFFF">
        {/* Left Cloud */}
        <path d="M 85 80 C 85 70 100 65 112 70 C 120 61 138 61 146 70 C 154 65 168 73 165 83 C 170 89 162 97 154 95 C 146 101 130 101 122 95 C 114 98 100 93 100 87 Z" />
        {/* Right Cloud */}
        <path d="M 255 74 C 255 64 270 60 282 64 C 290 56 308 56 316 64 C 324 60 336 68 332 78 C 338 84 330 92 322 90 C 314 96 298 96 290 90 C 280 92 268 88 268 81 Z" />
      </g>

      {/* 4. Stylized Botanical Line Art Foliage (Left Side) */}
      <g stroke="#3B82F6" strokeWidth="1.2" fill="none" opacity="0.75">
        {/* Main Branch Left */}
        <path d="M 45 190 Q 30 138 60 96" strokeWidth="1.5" />
        <path d="M 60 96 C 47 86 33 99 47 112 C 53 104 60 96 60 96 Z" fill="#93C5FD" fillOpacity="0.4" />
        <path d="M 49 122 C 35 116 29 130 41 137 C 46 131 49 122 49 122 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 53 148 C 39 144 35 157 47 161 C 51 155 53 148 53 148 Z" fill="#93C5FD" fillOpacity="0.35" />

        {/* Outer Bush Left */}
        <path d="M 25 200 Q 13 158 33 126" strokeWidth="1.3" />
        <path d="M 33 126 C 23 118 15 128 25 137 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 23 154 C 13 148 7 158 17 164 Z" fill="#93C5FD" fillOpacity="0.4" />
      </g>

      {/* 5. Stylized Botanical Line Art Foliage (Right Side) */}
      <g stroke="#3B82F6" strokeWidth="1.2" fill="none" opacity="0.75">
        {/* Main Branch Right */}
        <path d="M 355 190 Q 370 138 340 96" strokeWidth="1.5" />
        <path d="M 340 96 C 353 86 367 99 353 112 C 347 104 340 96 340 96 Z" fill="#93C5FD" fillOpacity="0.4" />
        <path d="M 351 122 C 365 116 371 130 359 137 C 354 131 351 122 351 122 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 347 148 C 361 144 365 157 353 161 C 349 155 347 148 347 148 Z" fill="#93C5FD" fillOpacity="0.35" />

        {/* Outer Bush Right */}
        <path d="M 375 200 Q 387 158 367 126" strokeWidth="1.3" />
        <path d="M 367 126 C 377 118 385 128 375 137 Z" fill="#BFDBFE" fillOpacity="0.4" />
        <path d="M 377 154 C 387 148 393 158 383 164 Z" fill="#93C5FD" fillOpacity="0.4" />
      </g>

      {/* 6. Soft Ground Wash */}
      <ellipse cx="200" cy="216" rx="178" ry="22" fill="url(#illuOvalGround)" />

      {/* 7. OVAL IN-GROUND POOL BASIN */}
      {/* Outer Stone Coping Rim Around Oval Pool */}
      <ellipse
        cx="200"
        cy="154"
        rx="160"
        ry="62"
        fill="url(#illuOvalCoping)"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />

      {/* Coping Stone Radial Joint Lines */}
      <g stroke="#94A3B8" strokeWidth="1" opacity="0.65">
        <line x1="200" y1="92" x2="200" y2="102" />
        <line x1="200" y1="206" x2="200" y2="216" />
        <line x1="40" y1="154" x2="54" y2="154" />
        <line x1="346" y1="154" x2="360" y2="154" />
        <line x1="88" y1="110" x2="98" y2="117" />
        <line x1="312" y1="110" x2="302" y2="117" />
        <line x1="88" y1="198" x2="98" y2="191" />
        <line x1="312" y1="198" x2="302" y2="191" />
        <line x1="140" y1="96" x2="144" y2="105" />
        <line x1="260" y1="96" x2="256" y2="105" />
        <line x1="140" y1="212" x2="144" y2="203" />
        <line x1="260" y1="212" x2="256" y2="203" />
      </g>

      {/* Inner Basin Oval Rim Border */}
      <ellipse
        cx="200"
        cy="154"
        rx="146"
        ry="52"
        fill="#003B7E"
        stroke="#0284C7"
        strokeWidth="1.2"
      />

      {/* Inside Basin Walls with Shimmering Pool Water */}
      <g clipPath="url(#illuOvalWaterClip)">
        {/* Deep Water Base Fill */}
        <rect x="40" y="90" width="320" height="130" fill="url(#illuOvalWater)" />

        {/* Deep Rear Curved Mosaic Wall */}
        <ellipse cx="200" cy="144" rx="146" ry="46" fill="url(#illuOvalWalls)" opacity="0.85" />

        {/* Water Caustics Shimmer Overlay */}
        <rect x="40" y="90" width="320" height="130" fill="url(#illuOvalCaustics)" />

        {/* Concentric Oval Water Waves & Ripple Lines */}
        <g stroke="#FFFFFF" fill="none" opacity="0.85" strokeLinecap="round">
          {/* Main Oval Wave Rings */}
          <ellipse cx="200" cy="156" rx="125" ry="42" strokeWidth="1.8" />
          <ellipse cx="200" cy="158" rx="90" ry="28" strokeWidth="1.6" strokeDasharray="24 10" opacity="0.75" />
          <ellipse cx="200" cy="160" rx="55" ry="16" strokeWidth="1.4" opacity="0.7" />

          {/* Gentle Surface Wave Crests */}
          <path d="M 85 152 Q 140 144 200 152 T 315 152" strokeWidth="2.2" />
          <path d="M 105 168 Q 150 162 200 168 T 295 168" strokeWidth="1.8" opacity="0.8" />
          <path d="M 130 182 Q 165 178 200 182 T 270 182" strokeWidth="1.5" opacity="0.7" />
          <path d="M 115 136 Q 155 130 200 136 T 285 136" strokeWidth="1.4" opacity="0.65" />
        </g>

        {/* Submerged Underwater Perspective Grid Lines */}
        <g stroke="rgba(255,255,255,0.28)" strokeWidth="0.8">
          <line x1="130" y1="108" x2="110" y2="200" />
          <line x1="165" y1="104" x2="155" y2="204" />
          <line x1="200" y1="102" x2="200" y2="206" />
          <line x1="235" y1="104" x2="245" y2="204" />
          <line x1="270" y1="108" x2="290" y2="200" />
        </g>

        {/* Specular White Sunlight Glare Highlights */}
        <ellipse cx="150" cy="120" rx="45" ry="5.5" fill="#FFFFFF" opacity="0.85" transform="rotate(-6 150 120)" />
        <ellipse cx="270" cy="125" rx="35" ry="4.5" fill="#FFFFFF" opacity="0.65" transform="rotate(4 270 125)" />
        <line x1="90" y1="195" x2="230" y2="195" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
        <line x1="250" y1="195" x2="310" y2="195" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* 8. Stainless Steel Pool Ladder on the Left Curve (from GUI reference) */}
      <g id="oval-pool-ladder-vector">
        {/* Left Ladder Handrail */}
        <path
          d="M 68 188 L 68 122 C 68 104 80 104 80 122 L 80 148"
          stroke="#94A3B8"
          strokeWidth="3.6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 68 188 L 68 122 C 68 104 80 104 80 122 L 80 148"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right Ladder Handrail */}
        <path
          d="M 82 192 L 82 122 C 82 104 94 104 94 122 L 94 152"
          stroke="#94A3B8"
          strokeWidth="3.6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 82 192 L 82 122 C 82 104 94 104 94 122 L 94 152"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Ladder Steps / Rungs */}
        <line x1="68" y1="138" x2="82" y2="138" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="154" x2="82" y2="154" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="170" x2="82" y2="170" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Deck mounting flanges */}
        <ellipse cx="68" cy="189" rx="4" ry="2" fill="#334155" />
        <ellipse cx="82" cy="193" rx="4" ry="2" fill="#334155" />
      </g>
    </svg>
  );
};

