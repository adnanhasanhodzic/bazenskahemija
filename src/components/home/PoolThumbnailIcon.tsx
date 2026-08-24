import React from 'react';
import { PoolShape } from '../../types/pool';

interface PoolThumbnailIconProps {
  shape: PoolShape;
  size?: number;
  className?: string;
}

export const PoolThumbnailIcon: React.FC<PoolThumbnailIconProps> = ({
  shape,
  size = 52,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-2xl bg-gradient-to-b from-[#0091FF] to-[#0062E3] p-1.5 flex items-center justify-center shadow-sm flex-shrink-0 border border-blue-400/30 ${className}`}
    >
      {shape === 'round' && (
        <svg
          viewBox="0 0 54 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Support Legs */}
          <line x1="8" y1="20" x2="8" y2="40" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
          <line x1="18" y1="22" x2="17" y2="42" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.95" />
          <line x1="36" y1="22" x2="37" y2="42" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.95" />
          <line x1="46" y1="20" x2="46" y2="40" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
          
          {/* Pool Liner Body */}
          <path
            d="M6 18 C6 18 6 36 27 36 C48 36 48 18 48 18 Z"
            fill="#0284C7"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.85"
          />
          {/* Top Frame Rim */}
          <ellipse cx="27" cy="18" rx="21" ry="8" fill="#38BDF8" stroke="white" strokeWidth="2" />
          {/* Water reflection highlight */}
          <ellipse cx="27" cy="19" rx="15" ry="5" fill="#7DD3FC" opacity="0.8" />
        </svg>
      )}

      {shape === 'rectangular' && (
        <svg
          viewBox="0 0 54 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Support legs */}
          <line x1="6" y1="26" x2="6" y2="40" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="48" y1="26" x2="48" y2="40" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="14" y1="14" x2="14" y2="28" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          <line x1="40" y1="14" x2="40" y2="28" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />

          {/* Front Wall */}
          <path d="M6 26 L48 26 L48 38 L6 38 Z" fill="#0284C7" stroke="white" strokeWidth="1.8" />
          {/* Top Surface */}
          <polygon points="6,26 14,14 40,14 48,26" fill="#38BDF8" stroke="white" strokeWidth="2" />
          <polygon points="12,24 17,16 37,16 42,24" fill="#7DD3FC" opacity="0.8" />
        </svg>
      )}

      {shape === 'oval' && (
        <svg
          viewBox="0 0 54 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Support Legs */}
          <line x1="6" y1="20" x2="6" y2="40" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="18" y1="24" x2="17" y2="42" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="36" y1="24" x2="37" y2="42" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="48" y1="20" x2="48" y2="40" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          
          {/* Liner */}
          <path d="M6 20 C6 36 48 36 48 20 Z" fill="#0284C7" stroke="white" strokeWidth="1.5" />
          {/* Oval Rim */}
          <ellipse cx="27" cy="20" rx="21" ry="9" fill="#38BDF8" stroke="white" strokeWidth="2" />
          <ellipse cx="27" cy="21" rx="16" ry="6" fill="#7DD3FC" opacity="0.8" />
        </svg>
      )}
    </div>
  );
};
