import React from 'react';
import { PoolShape } from '../../types/pool';
import { RoundPoolBanner } from './pool-banners/RoundPoolBanner';
import { RectangularPoolBanner } from './pool-banners/RectangularPoolBanner';
import { OvalPoolBanner } from './pool-banners/OvalPoolBanner';

interface PoolHeroBannerProps {
  shape?: PoolShape;
}

export const PoolHeroBanner: React.FC<PoolHeroBannerProps> = ({ shape = 'round' }) => {
  const renderShapeBanner = () => {
    switch (shape) {
      case 'rectangular':
        return <RectangularPoolBanner key="rectangular" className="w-full h-full max-h-[220px] sm:max-h-[240px] drop-shadow-xs" />;
      case 'oval':
        return <OvalPoolBanner key="oval" className="w-full h-full max-h-[220px] sm:max-h-[240px] drop-shadow-xs" />;
      case 'round':
      default:
        return <RoundPoolBanner key="round" className="w-full h-full max-h-[220px] sm:max-h-[240px] drop-shadow-xs" />;
    }
  };

  return (
    <div id="pool-hero-banner-container" className="w-full relative flex items-center justify-center bg-gradient-to-b from-[#EFF6FF] via-[#F3F8FF] to-white pt-3 pb-2 px-3 sm:px-6 select-none overflow-hidden">
      {/* Dynamic Pool Graphic based on active pool shape */}
      <div className="w-full max-w-md flex items-center justify-center transition-opacity duration-300">
        {renderShapeBanner()}
      </div>
    </div>
  );
};

