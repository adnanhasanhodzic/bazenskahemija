import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Trash2,
} from 'lucide-react';
import { Pool, PoolShape } from '../../types/pool';
import { RoundPoolIcon, RectangularPoolIcon, OvalPoolIcon } from './PoolShapeIcons';
import {
  calculateTotalVolumeLiters,
  calculateWorkingVolumeLiters,
  formatLiters,
} from '../../utils/poolCalculations';

interface PoolFormEditorProps {
  initialPool: Pool | null; // If null, create mode; if provided, edit mode
  onBack: () => void;
  onSave: (poolData: Omit<Pool, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onDeleteRequest?: (pool: Pool) => void;
}

export const PoolFormEditor: React.FC<PoolFormEditorProps> = ({
  initialPool,
  onBack,
  onSave,
  onDeleteRequest,
}) => {
  const isEditing = Boolean(initialPool);

  // Form state - All on ONE screen
  const [shape, setShape] = useState<PoolShape>(initialPool?.shape || 'round');
  const [name, setName] = useState<string>(initialPool?.name || '');

  // Dimensions (cm)
  const [diameter, setDiameter] = useState<string>(
    initialPool?.diameter ? initialPool.diameter.toString() : '366'
  );
  const [length, setLength] = useState<string>(
    initialPool?.length ? initialPool.length.toString() : '400'
  );
  const [width, setWidth] = useState<string>(
    initialPool?.width ? initialPool.width.toString() : '200'
  );
  const [height, setHeight] = useState<string>(
    initialPool?.height ? initialPool.height.toString() : '122'
  );

  // Fill percentage (default 90%)
  const [fillPercentage, setFillPercentage] = useState<number>(
    initialPool?.fillPercentage ?? 90
  );

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  useEffect(() => {
    if (initialPool) {
      setName(initialPool.name || '');
      setShape(initialPool.shape);
      setDiameter(initialPool.diameter ? initialPool.diameter.toString() : '366');
      setLength(initialPool.length ? initialPool.length.toString() : '400');
      setWidth(initialPool.width ? initialPool.width.toString() : '200');
      setHeight(initialPool.height ? initialPool.height.toString() : '122');
      setFillPercentage(initialPool.fillPercentage ?? 90);
    }
  }, [initialPool]);

  // Live calculated volumes
  const numDiameter = parseFloat(diameter) || 0;
  const numLength = parseFloat(length) || 0;
  const numWidth = parseFloat(width) || 0;
  const numHeight = parseFloat(height) || 0;

  const currentTotalVolume = shape
    ? calculateTotalVolumeLiters(shape, {
        diameter: numDiameter,
        length: numLength,
        width: numWidth,
        height: numHeight,
      })
    : 0;

  const currentWorkingVolume = calculateWorkingVolumeLiters(
    currentTotalVolume,
    fillPercentage
  );

  // Validation before saving
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Unesite naziv bazena (npr. Vršani 82).';
    }

    if (shape === 'round') {
      if (!numDiameter || numDiameter <= 0) {
        newErrors.diameter = 'Unesite prečnik bazena (veći od 0 cm).';
      }
      if (!numHeight || numHeight <= 0) {
        newErrors.height = 'Unesite visinu (dubinu) veću od 0 cm.';
      }
    } else {
      if (!numLength || numLength <= 0) {
        newErrors.length = 'Unesite dužinu bazena (veću od 0 cm).';
      }
      if (!numWidth || numWidth <= 0) {
        newErrors.width = 'Unesite širinu bazena (veću od 0 cm).';
      }
      if (!numHeight || numHeight <= 0) {
        newErrors.height = 'Unesite visinu (dubinu) veću od 0 cm.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const savedName = name.trim();

    onSave({
      id: initialPool?.id,
      name: savedName,
      shape,
      diameter: shape === 'round' ? numDiameter : undefined,
      length: shape !== 'round' ? numLength : undefined,
      width: shape !== 'round' ? numWidth : undefined,
      height: numHeight,
      fillPercentage,
      totalVolumeLiters: currentTotalVolume,
      workingVolumeLiters: currentWorkingVolume,
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onBack();
    }, 500);
  };

  return (
    <div className="w-full flex flex-col bg-white min-h-full pb-8">
      {/* 1. GORNJA NAVIGACIONA TRAKA (1:1 with GUI Reference) */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs px-4 py-3 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-from-editor"
            type="button"
            onClick={onBack}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none cursor-pointer"
            aria-label="Nazad"
          >
            <ArrowLeft size={22} strokeWidth={2.4} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#0F172A] leading-tight">
              Moj bazen
            </h1>
            <span className="text-[11px] text-slate-400 font-medium block">
              Uredi podatke o bazenu
            </span>
          </div>
        </div>

        {/* Action icons on right: ✓ (Save) and 🗑 (Delete) */}
        <div className="flex items-center gap-1">
          {/* ✓ Save checkmark button */}
          <button
            id="btn-save-pool-top-header"
            type="button"
            onClick={handleSave}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#0062E3] hover:bg-blue-50 active:bg-blue-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Sačuvaj izmjene"
            title="Sačuvaj izmjene"
          >
            <Check size={24} strokeWidth={3} />
          </button>

          {/* 🗑 Delete trash icon */}
          {isEditing && onDeleteRequest && initialPool ? (
            <button
              id="btn-delete-current-pool"
              type="button"
              onClick={() => onDeleteRequest(initialPool)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Obriši bazen"
              title="Obriši bazen"
            >
              <Trash2 size={20} strokeWidth={2.2} />
            </button>
          ) : (
            <div className="w-1" />
          )}
        </div>
      </div>

      {/* Main Single-Screen Content (1:1 Matching GUI) */}
      <div className="px-5 py-4 max-w-md mx-auto w-full space-y-5">

        {/* ---------------------------------------------------- */}
        {/* NAZIV BAZENA (Obavezno polje)                        */}
        {/* ---------------------------------------------------- */}
        <section id="section-pool-name-input" className="space-y-1.5">
          <label
            htmlFor="input-pool-name"
            className="block text-sm font-bold text-[#0F172A]"
          >
            Naziv bazena
          </label>
          <input
            id="input-pool-name"
            type="text"
            placeholder="Unesite naziv bazena (npr. Vršani 82)"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: '' }));
              }
            }}
            className={`w-full py-2.5 px-3.5 bg-white border rounded-xl text-base font-semibold text-[#0F172A] placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.name ? 'border-red-400 bg-red-50/20 ring-1 ring-red-400' : 'border-slate-200 hover:border-slate-300'
            }`}
          />
          {errors.name && (
            <p className="text-[11px] text-red-500 font-medium mt-1">
              {errors.name}
            </p>
          )}
        </section>

        {/* ---------------------------------------------------- */}
        {/* 1. ODABERI OBLIK BAZENA                              */}
        {/* ---------------------------------------------------- */}
        <section id="section-pool-shape-selector" className="space-y-2.5">
          <h2 className="text-sm font-bold text-[#0F172A]">
            1. Odaberi oblik bazena
          </h2>

          {/* 3 Shape Cards: Okrugli, Pravougaoni, Ovalni */}
          <div className="grid grid-cols-3 gap-3">
            {/* Okrugli */}
            <button
              id="btn-shape-round"
              type="button"
              onClick={() => {
                setShape('round');
                setErrors({});
              }}
              className={`flex flex-col items-center justify-between p-3 h-28 rounded-2xl transition-all cursor-pointer ${
                shape === 'round'
                  ? 'border-2 border-[#0062E3] bg-[#F5F9FF] shadow-xs'
                  : 'border border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex-1 flex items-center justify-center">
                <RoundPoolIcon size={56} />
              </div>
              <span
                className={`text-xs font-bold ${
                  shape === 'round' ? 'text-[#0F172A]' : 'text-slate-700'
                }`}
              >
                Okrugli
              </span>
            </button>

            {/* Pravougaoni */}
            <button
              id="btn-shape-rectangular"
              type="button"
              onClick={() => {
                setShape('rectangular');
                setErrors({});
              }}
              className={`flex flex-col items-center justify-between p-3 h-28 rounded-2xl transition-all cursor-pointer ${
                shape === 'rectangular'
                  ? 'border-2 border-[#0062E3] bg-[#F5F9FF] shadow-xs'
                  : 'border border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex-1 flex items-center justify-center">
                <RectangularPoolIcon size={56} />
              </div>
              <span
                className={`text-xs font-bold ${
                  shape === 'rectangular' ? 'text-[#0F172A]' : 'text-slate-700'
                }`}
              >
                Pravougaoni
              </span>
            </button>

            {/* Ovalni */}
            <button
              id="btn-shape-oval"
              type="button"
              onClick={() => {
                setShape('oval');
                setErrors({});
              }}
              className={`flex flex-col items-center justify-between p-3 h-28 rounded-2xl transition-all cursor-pointer ${
                shape === 'oval'
                  ? 'border-2 border-[#0062E3] bg-[#F5F9FF] shadow-xs'
                  : 'border border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex-1 flex items-center justify-center">
                <OvalPoolIcon size={56} />
              </div>
              <span
                className={`text-xs font-bold ${
                  shape === 'oval' ? 'text-[#0F172A]' : 'text-slate-700'
                }`}
              >
                Ovalni
              </span>
            </button>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 2. UNESI DIMENZIJE                                   */}
        {/* ---------------------------------------------------- */}
        <section id="section-pool-dimensions-input" className="space-y-3">
          <h2 className="text-sm font-bold text-[#0F172A]">
            2. Unesi dimenzije
          </h2>

          {/* If Round: Prečnik & Visina (dubina) */}
          {shape === 'round' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="input-pool-diameter"
                    className="block text-xs text-slate-600 font-medium mb-1"
                  >
                    Prečnik
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="input-pool-diameter"
                      type="number"
                      inputMode="decimal"
                      placeholder="366"
                      value={diameter}
                      onChange={(e) => {
                        setDiameter(e.target.value);
                        setErrors((prev) => ({ ...prev, diameter: '' }));
                      }}
                      className={`w-full py-2.5 pl-3.5 pr-10 bg-white border rounded-xl text-base font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.diameter ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    <span className="absolute right-3.5 text-xs text-slate-400 font-medium">
                      cm
                    </span>
                  </div>
                  {errors.diameter && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">
                      {errors.diameter}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="input-pool-height"
                    className="block text-xs text-slate-600 font-medium mb-1"
                  >
                    Visina (dubina)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="input-pool-height"
                      type="number"
                      inputMode="decimal"
                      placeholder="122"
                      value={height}
                      onChange={(e) => {
                        setHeight(e.target.value);
                        setErrors((prev) => ({ ...prev, height: '' }));
                      }}
                      className={`w-full py-2.5 pl-3.5 pr-10 bg-white border rounded-xl text-base font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.height ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    <span className="absolute right-3.5 text-xs text-slate-400 font-medium">
                      cm
                    </span>
                  </div>
                  {errors.height && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">
                      {errors.height}
                    </p>
                  )}
                </div>
              </div>

              {/* Standardne dimenzije (Round) */}
              <div className="pt-1">
                <span className="text-[11px] font-medium text-slate-500 block mb-1.5">
                  Standardne dimenzije:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { d: 305, h: 76, label: 'Ø 305 × 76 cm' },
                    { d: 366, h: 76, label: 'Ø 366 × 76 cm' },
                    { d: 366, h: 100, label: 'Ø 366 × 100 cm' },
                    { d: 366, h: 122, label: 'Ø 366 × 122 cm' },
                    { d: 457, h: 122, label: 'Ø 457 × 122 cm' },
                    { d: 549, h: 132, label: 'Ø 549 × 132 cm' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setDiameter(p.d.toString());
                        setHeight(p.h.toString());
                        setErrors({});
                      }}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#0062E3] text-slate-700 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* If Rectangular: Dužina & Širina & Visina */}
          {shape === 'rectangular' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="input-pool-length"
                    className="block text-xs text-slate-600 font-medium mb-1"
                  >
                    Dužina
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="input-pool-length"
                      type="number"
                      inputMode="decimal"
                      placeholder="400"
                      value={length}
                      onChange={(e) => {
                        setLength(e.target.value);
                        setErrors((prev) => ({ ...prev, length: '' }));
                      }}
                      className={`w-full py-2.5 pl-3.5 pr-10 bg-white border rounded-xl text-base font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.length ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    <span className="absolute right-3.5 text-xs text-slate-400 font-medium">
                      cm
                    </span>
                  </div>
                  {errors.length && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">
                      {errors.length}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="input-pool-width"
                    className="block text-xs text-slate-600 font-medium mb-1"
                  >
                    Širina
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="input-pool-width"
                      type="number"
                      inputMode="decimal"
                      placeholder="200"
                      value={width}
                      onChange={(e) => {
                        setWidth(e.target.value);
                        setErrors((prev) => ({ ...prev, width: '' }));
                      }}
                      className={`w-full py-2.5 pl-3.5 pr-10 bg-white border rounded-xl text-base font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.width ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    <span className="absolute right-3.5 text-xs text-slate-400 font-medium">
                      cm
                    </span>
                  </div>
                  {errors.width && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">
                      {errors.width}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="input-pool-height-rect"
                  className="block text-xs text-slate-600 font-medium mb-1"
                >
                  Visina (dubina)
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-pool-height-rect"
                    type="number"
                    inputMode="decimal"
                    placeholder="122"
                    value={height}
                    onChange={(e) => {
                      setHeight(e.target.value);
                      setErrors((prev) => ({ ...prev, height: '' }));
                    }}
                    className={`w-full py-2.5 pl-3.5 pr-10 bg-white border rounded-xl text-base font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.height ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                  <span className="absolute right-3.5 text-xs text-slate-400 font-medium">
                    cm
                  </span>
                </div>
                {errors.height && (
                  <p className="text-[11px] text-red-500 font-medium mt-1">
                    {errors.height}
                  </p>
                )}
              </div>

              {/* Standardne dimenzije (Rectangular) */}
              <div className="pt-1">
                <span className="text-[11px] font-medium text-slate-500 block mb-1.5">
                  Standardne dimenzije:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { l: 300, w: 200, h: 75, label: '300 × 200 × 75 cm' },
                    { l: 400, w: 200, h: 100, label: '400 × 200 × 100 cm' },
                    { l: 400, w: 200, h: 122, label: '400 × 200 × 122 cm' },
                    { l: 549, w: 274, h: 122, label: '549 × 274 × 122 cm' },
                    { l: 732, w: 366, h: 132, label: '732 × 366 × 132 cm' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setLength(p.l.toString());
                        setWidth(p.w.toString());
                        setHeight(p.h.toString());
                        setErrors({});
                      }}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#0062E3] text-slate-700 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* If Oval: Dužina & Širina & Visina */}
          {shape === 'oval' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="input-pool-length-oval"
                    className="block text-xs text-slate-600 font-medium mb-1"
                  >
                    Dužina
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="input-pool-length-oval"
                      type="number"
                      inputMode="decimal"
                      placeholder="500"
                      value={length}
                      onChange={(e) => {
                        setLength(e.target.value);
                        setErrors((prev) => ({ ...prev, length: '' }));
                      }}
                      className={`w-full py-2.5 pl-3.5 pr-10 bg-white border rounded-xl text-base font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.length ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    <span className="absolute right-3.5 text-xs text-slate-400 font-medium">
                      cm
                    </span>
                  </div>
                  {errors.length && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">
                      {errors.length}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="input-pool-width-oval"
                    className="block text-xs text-slate-600 font-medium mb-1"
                  >
                    Širina
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="input-pool-width-oval"
                      type="number"
                      inputMode="decimal"
                      placeholder="300"
                      value={width}
                      onChange={(e) => {
                        setWidth(e.target.value);
                        setErrors((prev) => ({ ...prev, width: '' }));
                      }}
                      className={`w-full py-2.5 pl-3.5 pr-10 bg-white border rounded-xl text-base font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.width ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    <span className="absolute right-3.5 text-xs text-slate-400 font-medium">
                      cm
                    </span>
                  </div>
                  {errors.width && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">
                      {errors.width}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="input-pool-height-oval"
                  className="block text-xs text-slate-600 font-medium mb-1"
                >
                  Visina (dubina)
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-pool-height-oval"
                    type="number"
                    inputMode="decimal"
                    placeholder="120"
                    value={height}
                    onChange={(e) => {
                      setHeight(e.target.value);
                      setErrors((prev) => ({ ...prev, height: '' }));
                    }}
                    className={`w-full py-2.5 pl-3.5 pr-10 bg-white border rounded-xl text-base font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.height ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                  <span className="absolute right-3.5 text-xs text-slate-400 font-medium">
                    cm
                  </span>
                </div>
                {errors.height && (
                  <p className="text-[11px] text-red-500 font-medium mt-1">
                    {errors.height}
                  </p>
                )}
              </div>

              {/* Standardne dimenzije (Oval) */}
              <div className="pt-1">
                <span className="text-[11px] font-medium text-slate-500 block mb-1.5">
                  Standardne dimenzije:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { l: 427, w: 275, h: 100, label: '427 × 275 × 100 cm' },
                    { l: 500, w: 300, h: 120, label: '500 × 300 × 120 cm' },
                    { l: 610, w: 366, h: 122, label: '610 × 366 × 122 cm' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setLength(p.l.toString());
                        setWidth(p.w.toString());
                        setHeight(p.h.toString());
                        setErrors({});
                      }}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#0062E3] text-slate-700 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------- */}
        {/* 3. POPUNJENOST BAZENA                                */}
        {/* ---------------------------------------------------- */}
        <section id="section-pool-fill-percentage" className="space-y-2.5">
          <h2 className="text-sm font-bold text-[#0F172A]">
            3. Popunjenost bazena
          </h2>

          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            <span>{fillPercentage}%</span>
            <span className="text-slate-500 font-normal">(preporučeno)</span>
          </div>

          {/* Slider 50% to 100% */}
          <div className="pt-1">
            <input
              id="slider-fill-percentage"
              type="range"
              min="50"
              max="100"
              step="5"
              value={fillPercentage}
              onChange={(e) => setFillPercentage(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0062E3]"
            />
            <div className="flex justify-between text-xs font-medium text-slate-400 mt-1">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* PRIKAZ IZRAČUNA ZAPREMINE (1:1 with GUI Reference)  */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-volume-calculation-display"
          className="bg-[#F1F6FB] rounded-2xl p-4 border border-blue-100/80 shadow-xs"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Zapremina bazena (100%) */}
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                Zapremina bazena (100%)
              </span>
              <div className="text-xl font-extrabold text-[#0F172A] mt-1 tracking-tight">
                {currentTotalVolume > 0 ? `${formatLiters(currentTotalVolume)} L` : '0 L'}
              </div>
            </div>

            {/* Radna zapremina (90%) - Green bold as in screenshot */}
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                Radna zapremina ({fillPercentage}%)
              </span>
              <div className="text-xl font-extrabold text-[#16A34A] mt-1 tracking-tight">
                {currentWorkingVolume > 0 ? `${formatLiters(currentWorkingVolume)} L` : '0 L'}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-16 inset-x-4 max-w-sm mx-auto bg-slate-900 text-white py-3 px-4 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
            <Check size={16} strokeWidth={3} />
          </div>
          <span className="text-xs font-bold">
            Bazen je uspješno {isEditing ? 'ažuriran' : 'sačuvan'}!
          </span>
        </div>
      )}
    </div>
  );
};
