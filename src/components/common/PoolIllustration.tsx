import React from 'react';

interface PoolIllustrationProps {
  variant?: 'splash' | 'empty-state';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
}

export const PoolIllustration: React.FC<PoolIllustrationProps> = ({
  variant = 'empty-state',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none w-full max-w-[340px] aspect-[1.1/1] ${className}`}>
      <svg
        viewBox="0 0 400 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
        aria-label="Ilustracija bazena"
      >
        <defs>
          {/* Water gradient */}
          <linearGradient id="waterSurface" x1="200" y1="180" x2="200" y2="235" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0072E8" />
            <stop offset="60%" stopColor="#0088FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Mosaic Liner gradient */}
          <linearGradient id="mosaicWall" x1="200" y1="175" x2="200" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#003E92" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Outer wall gradient */}
          <linearGradient id="outerWallGrad" x1="200" y1="210" x2="200" y2="295" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#F1F5F9" />
            <stop offset="70%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Ground shadow gradient */}
          <radialGradient id="groundShadow" cx="200" cy="285" r="170" fx="200" fy="285" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#E0F2FE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0" />
          </radialGradient>

          {/* Foliage gradient */}
          <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>

          <clipPath id="innerPoolClip">
            <ellipse cx="200" cy="220" rx="140" ry="42" />
          </clipPath>

          <pattern id="poolTilePattern" width="14" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
            <rect width="14" height="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* Soft background clouds for empty state */}
        {variant === 'empty-state' && (
          <g opacity="0.65">
            {/* Top Cloud 1 */}
            <path
              d="M110 95 C110 85 125 78 140 85 C148 75 170 75 180 85 C190 80 205 90 200 100 C205 108 195 118 185 115 C175 122 155 122 145 115 C135 118 120 112 120 105 Z"
              fill="#E0F2FE"
            />
            {/* Top Cloud 2 */}
            <path
              d="M260 90 C260 80 275 75 288 80 C295 72 315 72 322 80 C330 76 342 85 338 95 C344 102 335 110 326 108 C318 114 300 114 292 108 C282 110 270 105 270 98 Z"
              fill="#E0F2FE"
            />
          </g>
        )}

        {/* Ground shadow puddle */}
        <ellipse cx="200" cy="285" rx="165" ry="32" fill="url(#groundShadow)" />

        {/* Background Foliage Leaves (Left) */}
        <g>
          {/* Leaf 1 far left */}
          <path
            d="M60 250 C45 220 50 180 75 160 C80 185 75 220 60 250 Z"
            fill="#93C5FD"
            opacity="0.9"
          />
          {/* Leaf 2 mid left */}
          <path
            d="M85 260 C70 210 85 170 110 145 C115 175 105 220 85 260 Z"
            fill="#60A5FA"
            opacity="0.85"
          />
          {/* Leaf 3 lower left */}
          <path
            d="M50 265 C40 240 45 210 65 195 C68 215 62 245 50 265 Z"
            fill="#BFDBFE"
          />
        </g>

        {/* Background Foliage Leaves (Right) */}
        <g>
          {/* Leaf 1 far right */}
          <path
            d="M340 250 C355 220 350 180 325 160 C320 185 325 220 340 250 Z"
            fill="#93C5FD"
            opacity="0.9"
          />
          {/* Leaf 2 mid right */}
          <path
            d="M315 260 C330 210 315 170 290 145 C285 175 295 220 315 260 Z"
            fill="#60A5FA"
            opacity="0.85"
          />
          {/* Leaf 3 lower right */}
          <path
            d="M350 265 C360 240 355 210 335 195 C332 215 338 245 350 265 Z"
            fill="#BFDBFE"
          />
        </g>

        {/* Water drops splashing in air */}
        <g fill="#38BDF8">
          <ellipse cx="260" cy="165" rx="3.5" ry="6" transform="rotate(25 260 165)" opacity="0.85" />
          <ellipse cx="275" cy="155" rx="3" ry="5.5" transform="rotate(35 275 155)" opacity="0.9" />
          <ellipse cx="290" cy="170" rx="2.5" ry="4.5" transform="rotate(45 290 170)" opacity="0.75" />
          <ellipse cx="250" cy="150" rx="2" ry="4" transform="rotate(15 250 150)" opacity="0.6" />
        </g>

        {/* Pool Structure Back Wall */}
        <ellipse cx="200" cy="208" rx="142" ry="40" fill="#003E92" stroke="#CBD5E1" strokeWidth="2" />

        {/* Pool Interior - Mosaic Tile Wall & Water */}
        <g clipPath="url(#innerPoolClip)">
          {/* Mosaic back wall fill */}
          <rect x="50" y="170" width="300" height="90" fill="url(#mosaicWall)" />
          {/* Tile Grid */}
          <rect x="50" y="170" width="300" height="90" fill="url(#poolTilePattern)" />

          {/* Water Surface Oval */}
          <ellipse cx="200" cy="226" rx="138" ry="32" fill="url(#waterSurface)" />

          {/* Water Ripples and Reflection Lines */}
          <path
            d="M95 224 Q 140 216, 200 224 T 305 224"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M120 234 Q 160 228, 200 234 T 280 234"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d="M145 242 Q 175 238, 200 242 T 255 242"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Bottom tile reflection through clear water */}
          <g opacity="0.3" stroke="#FFFFFF" strokeWidth="1">
            <line x1="100" y1="235" x2="300" y2="235" />
            <line x1="120" y1="245" x2="280" y2="245" />
            <line x1="140" y1="220" x2="130" y2="255" />
            <line x1="170" y1="220" x2="165" y2="255" />
            <line x1="200" y1="220" x2="200" y2="255" />
            <line x1="230" y1="220" x2="235" y2="255" />
            <line x1="260" y1="220" x2="270" y2="255" />
          </g>
        </g>

        {/* Pool Outer Structure - Front Round Body */}
        <g>
          {/* Main outer cylinder wall body */}
          <path
            d="M58 208 C58 208, 58 260, 62 272 C70 286, 120 298, 200 298 C280 298, 330 286, 338 272 C342 260, 342 208, 342 208 C342 230, 278 248, 200 248 C122 248, 58 230, 58 208 Z"
            fill="url(#outerWallGrad)"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />

          {/* Segment Panels - Vertical Seams & Structural Ribs */}
          {/* Rib 1 (Left-most) */}
          <path d="M96 236 L98 285" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="94" y="283" width="8" height="6" rx="2" fill="#334155" />
          <circle cx="98" cy="235" r="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />

          {/* Rib 2 */}
          <path d="M142 244 L144 293" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="140" y="291" width="8" height="6" rx="2" fill="#334155" />
          <circle cx="144" cy="243" r="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />

          {/* Rib 3 (Center-Left) */}
          <path d="M198 248 L198 297" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="194" y="295" width="8" height="6" rx="2" fill="#334155" />
          <circle cx="198" cy="247" r="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />

          {/* Rib 4 */}
          <path d="M256 244 L254 293" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="250" y="291" width="8" height="6" rx="2" fill="#334155" />
          <circle cx="254" cy="243" r="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />

          {/* Rib 5 (Right-most) */}
          <path d="M302 236 L300 285" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="296" y="283" width="8" height="6" rx="2" fill="#334155" />
          <circle cx="300" cy="235" r="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />

          {/* Top Rail White Rim Profile */}
          <path
            d="M56 208 C56 186, 120 168, 200 168 C280 168, 344 186, 344 208 C344 230, 280 248, 200 248 C120 248, 56 230, 56 208 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
          />
          <path
            d="M56 208 C56 186, 120 168, 200 168 C280 168, 344 186, 344 208 C344 230, 280 248, 200 248 C120 248, 56 230, 56 208 Z"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          {/* Top corner brackets / joints */}
          <rect x="54" y="204" width="7" height="6" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <rect x="339" y="204" width="7" height="6" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        </g>

        {/* Steel Ladder on Left */}
        <g>
          {/* Ladder shadow */}
          <path d="M78 280 L76 292" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          <path d="M92 284 L90 295" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

          {/* Left curved handrail */}
          <path
            d="M80 286 L80 185 C80 162, 92 160, 92 185 L92 215"
            stroke="#94A3B8"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M80 286 L80 185 C80 162, 92 160, 92 185 L92 215"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Right curved handrail */}
          <path
            d="M96 288 L96 185 C96 162, 108 160, 108 185 L108 218"
            stroke="#94A3B8"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M96 288 L96 185 C96 162, 108 160, 108 185 L108 218"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Ladder Rungs */}
          <line x1="80" y1="205" x2="96" y2="205" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="225" x2="96" y2="225" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="245" x2="96" y2="245" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="265" x2="96" y2="265" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />

          {/* Ladder feet */}
          <rect x="76" y="285" width="8" height="4" rx="1" fill="#334155" />
          <rect x="92" y="287" width="8" height="4" rx="1" fill="#334155" />
        </g>

        {/* Empty State Overlay Graphics: Circular Dotted Orbit & Floating Question Mark */}
        {variant === 'empty-state' && (
          <g>
            {/* Dashed circular orbit above pool */}
            <ellipse
              cx="200"
              cy="125"
              rx="135"
              ry="24"
              fill="none"
              stroke="#0080FF"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              opacity="0.65"
            />

            {/* Glowing friendly Question Mark in center */}
            <g transform="translate(178, 60)">
              {/* Question mark shadow */}
              <text
                x="22"
                y="52"
                fill="#BFDBFE"
                fontSize="62"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                textAnchor="middle"
                opacity="0.6"
              >
                ?
              </text>
              {/* Question mark body */}
              <text
                x="20"
                y="50"
                fill="#0077FE"
                fontSize="62"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                textAnchor="middle"
                className="drop-shadow-sm"
              >
                ?
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
