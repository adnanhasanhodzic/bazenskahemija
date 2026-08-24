import React from 'react';
import { ProductCategoryId } from '../../types/product';

interface ProductIconProps {
  categoryId: ProductCategoryId;
  size?: number;
  className?: string;
}

export const ProductIcon: React.FC<ProductIconProps> = ({
  categoryId,
  size = 48,
  className = '',
}) => {
  switch (categoryId) {
    case 'ph_minus':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Blue Arrow pointing down with "pH" */}
          <path
            d="M20 12V34M20 34L13 27M20 34L27 27"
            stroke="#0284C7"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="29"
            y="26"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="18"
            fill="#0F172A"
            letterSpacing="-0.5"
          >
            pH
          </text>
        </svg>
      );

    case 'ph_plus':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Green Arrow pointing up with "pH" */}
          <path
            d="M20 34V12M20 12L13 19M20 12L27 19"
            stroke="#16A34A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="29"
            y="26"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="18"
            fill="#0F172A"
            letterSpacing="-0.5"
          >
            pH
          </text>
        </svg>
      );

    case 'chlorine_tablets_20g':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* 2 stacked small chlorine tablets */}
          {/* Bottom tablet */}
          <ellipse cx="23" cy="30" rx="14" ry="7" fill="#CBD5E1" />
          <path d="M9 30v4c0 3.8 6.3 7 14 7s14-3.2 14-7v-4" fill="#94A3B8" />
          <ellipse cx="23" cy="30" rx="13" ry="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />

          {/* Top tablet slightly offset */}
          <ellipse cx="29" cy="21" rx="14" ry="7" fill="#E2E8F0" />
          <path d="M15 21v4c0 3.8 6.3 7 14 7s14-3.2 14-7v-4" fill="#CBD5E1" />
          <ellipse cx="29" cy="21" rx="13" ry="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <ellipse cx="28" cy="20" rx="8" ry="3" fill="#F8FAFC" />
        </svg>
      );

    case 'chlorine_tablets_200g':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Large single 200g chlorine puck tablet */}
          <ellipse cx="27" cy="23" rx="19" ry="9.5" fill="#E2E8F0" />
          <path d="M8 23v10c0 5.2 8.5 9.5 19 9.5s19-4.3 19-9.5V23" fill="#94A3B8" />
          <ellipse cx="27" cy="23" rx="18" ry="8.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
          <ellipse cx="27" cy="22" rx="12" ry="5" fill="#F8FAFC" />
        </svg>
      );

    case 'multi_tablets_20g':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Tablet with 20g badge */}
          <ellipse cx="22" cy="23" rx="15" ry="8" fill="#E2E8F0" />
          <path d="M7 23v7c0 4.4 6.7 8 15 8s15-3.6 15-8v-7" fill="#94A3B8" />
          <ellipse cx="22" cy="23" rx="14" ry="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />

          {/* 20g Blue Badge */}
          <rect x="25" y="22" width="24" height="15" rx="5" fill="#0062E3" />
          <text
            x="37"
            y="33"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="800"
            fontSize="9"
            fill="#FFFFFF"
          >
            20g
          </text>
        </svg>
      );

    case 'multi_tablets_200g':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Tablet with 200g badge */}
          <ellipse cx="21" cy="22" rx="16" ry="8.5" fill="#E2E8F0" />
          <path d="M5 22v8c0 4.7 7.2 8.5 16 8.5s16-3.8 16-8.5v-8" fill="#94A3B8" />
          <ellipse cx="21" cy="22" rx="15" ry="7.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />

          {/* 200g Blue Badge */}
          <rect x="23" y="23" width="28" height="15" rx="5" fill="#0062E3" />
          <text
            x="37"
            y="34"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="800"
            fontSize="8.5"
            fill="#FFFFFF"
          >
            200g
          </text>
        </svg>
      );

    case 'chlorine_granules':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Granule crystals pile */}
          <g fill="#38BDF8">
            <circle cx="27" cy="14" r="3.5" />
            <circle cx="21" cy="19" r="3" />
            <circle cx="33" cy="19" r="3.2" />
            <circle cx="16" cy="26" r="3.5" fill="#0284C7" />
            <circle cx="24" cy="25" r="3.8" fill="#0EA5E9" />
            <circle cx="32" cy="26" r="3.6" fill="#0284C7" />
            <circle cx="39" cy="28" r="3" />
            <circle cx="11" cy="34" r="3.2" fill="#0369A1" />
            <circle cx="18" cy="33" r="4" fill="#0284C7" />
            <circle cx="27" cy="32" r="4.2" fill="#0EA5E9" />
            <circle cx="35" cy="33" r="3.8" fill="#0284C7" />
            <circle cx="43" cy="35" r="3" fill="#0369A1" />
            <circle cx="14" cy="40" r="3.5" fill="#0369A1" />
            <circle cx="22" cy="39" r="4" fill="#0369A1" />
            <circle cx="31" cy="39" r="4" fill="#0369A1" />
            <circle cx="39" cy="40" r="3.5" fill="#0369A1" />
          </g>
          {/* Highlights */}
          <circle cx="26" cy="13" r="1" fill="#FFFFFF" />
          <circle cx="23" cy="24" r="1.2" fill="#FFFFFF" />
          <circle cx="26" cy="31" r="1.3" fill="#FFFFFF" />
        </svg>
      );

    case 'shock_chlorine':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Granule pile + sparkle stars */}
          <g fill="#0EA5E9">
            <circle cx="27" cy="18" r="3.5" />
            <circle cx="21" cy="23" r="3" />
            <circle cx="33" cy="23" r="3.2" />
            <circle cx="16" cy="30" r="3.5" fill="#0284C7" />
            <circle cx="25" cy="29" r="3.8" fill="#38BDF8" />
            <circle cx="33" cy="30" r="3.6" fill="#0284C7" />
            <circle cx="40" cy="32" r="3" />
            <circle cx="12" cy="38" r="3.2" fill="#0369A1" />
            <circle cx="20" cy="37" r="4" fill="#0284C7" />
            <circle cx="28" cy="36" r="4.2" fill="#38BDF8" />
            <circle cx="36" cy="37" r="3.8" fill="#0284C7" />
            <circle cx="43" cy="39" r="3" fill="#0369A1" />
          </g>
          {/* Sparkles on top */}
          <path
            d="M38 10L39.5 14L43.5 15.5L39.5 17L38 21L36.5 17L32.5 15.5L36.5 14L38 10Z"
            fill="#0284C7"
          />
          <path
            d="M16 11L17 13.5L19.5 14.5L17 15.5L16 18L15 15.5L12.5 14.5L15 13.5L16 11Z"
            fill="#38BDF8"
          />
        </svg>
      );

    case 'flocculant':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Canister with handle */}
          <rect x="18" y="18" width="18" height="24" rx="4" fill="#8B5CF6" />
          {/* Handle */}
          <path
            d="M23 18V12H31V18"
            stroke="#7C3AED"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Cap */}
          <rect x="24" y="8" width="6" height="5" rx="1.5" fill="#6D28D9" />
          {/* Handle loop opening */}
          <rect x="22" y="24" width="10" height="8" rx="2" fill="#EDE9FE" opacity="0.9" />
          <path d="M25 28H29" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'algaecide':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Erlenmeyer laboratory beaker */}
          <path
            d="M23 10V18L12 38C10.5 40.5 12.5 44 15.5 44H38.5C41.5 44 43.5 40.5 42 38L31 18V10H23Z"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Liquid fill */}
          <path
            d="M16 35L20 28H34L38 35C39 37 38 41 36 41H18C16 41 15 37 16 35Z"
            fill="#34D399"
            opacity="0.85"
          />
          <circle cx="24" cy="34" r="1.5" fill="#FFFFFF" />
          <circle cx="30" cy="36" r="2" fill="#FFFFFF" />
          <circle cx="28" cy="30" r="1" fill="#FFFFFF" />
        </svg>
      );

    case 'active_oxygen':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Oxygen Bubbles cluster */}
          <circle cx="27" cy="27" r="18" stroke="#06B6D4" strokeWidth="2.5" strokeDasharray="3 3" />
          <circle cx="27" cy="27" r="6" fill="#0891B2" />
          <circle cx="18" cy="20" r="4" fill="#22D3EE" />
          <circle cx="36" cy="20" r="4.5" fill="#06B6D4" />
          <circle cx="20" cy="35" r="3" fill="#67E8F9" />
          <circle cx="34" cy="34" r="3.5" fill="#22D3EE" />
        </svg>
      );

    case 'crystallizer':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Water drop with sparkling shimmer */}
          <path
            d="M27 9C27 9 14 24 14 33C14 40.2 19.8 46 27 46C34.2 46 40 40.2 40 33C40 24 27 9 27 9Z"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth="2"
          />
          {/* Inner Shimmer reflection */}
          <path
            d="M23 20C21 24 20 28 20 32"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="22" cy="18" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    case 'anti_scale':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Golden Shield with inner drop */}
          <path
            d="M27 9L12 15V27C12 36.5 18.5 44.5 27 47C35.5 44.5 42 36.5 42 27V15L27 9Z"
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Drop inside shield */}
          <path
            d="M27 20C27 20 20 28 20 32.5C20 36.4 23.1 39.5 27 39.5C30.9 39.5 34 36.4 34 32.5C34 28 27 20 27 20Z"
            fill="#F59E0B"
          />
        </svg>
      );

    case 'waterline_cleaner':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Squeegee / Cleaning Brush wiping water */}
          <path
            d="M20 12L34 24"
            stroke="#0284C7"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect
            x="24"
            y="26"
            width="22"
            height="8"
            rx="2"
            transform="rotate(-40 24 26)"
            fill="#06B6D4"
          />
          <path
            d="M12 40Q 22 36 32 40T 44 38"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'winterizing':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Graduated test tube */}
          <rect
            x="22"
            y="8"
            width="10"
            height="32"
            rx="5"
            stroke="#6366F1"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Tube Lip */}
          <path d="M19 8H35" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
          {/* Liquid Fill */}
          <rect x="23.5" y="20" width="7" height="19" rx="3.5" fill="#818CF8" />
          {/* Graduation lines */}
          <line x1="28" y1="16" x2="31" y2="16" stroke="#6366F1" strokeWidth="1.5" />
          <line x1="26" y1="22" x2="31" y2="22" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="26" y1="28" x2="31" y2="28" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      );

    case 'other':
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Three dots ... */}
          <circle cx="16" cy="27" r="3.5" fill="#64748B" />
          <circle cx="27" cy="27" r="3.5" fill="#64748B" />
          <circle cx="38" cy="27" r="3.5" fill="#64748B" />
        </svg>
      );
  }
};
