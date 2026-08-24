import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Info,
  Trash2,
  Building2,
  PlusCircle,
  AlertTriangle,
  HelpCircle,
  X,
  Calculator,
  Calendar,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ProductCategoryId,
  DosageUnit,
  DosageFrequency,
  DosageType,
  PhCorrectionDirection,
  ProductDosage,
  Manufacturer,
} from '../../types/product';
import {
  PREDEFINED_PRODUCT_TYPES,
  getSavedManufacturers,
  getSavedUserProducts,
  saveManufacturerWithProducts,
  deleteManufacturerAndProducts,
  computeCalculatorAmount,
  computePhEffectAverage,
  formatFrequencyLabel,
  formatDosageTypeLabel,
  formatPhDirectionLabel,
  sortProductsByGlobalOrder,
} from '../../utils/productStorage';
import { ProductIcon } from './ProductIcons';

interface SelectedProductState {
  categoryId: ProductCategoryId;
  customTitle?: string;
  dosageType: DosageType;
  minAmount: number | '';
  maxAmount: number | '';
  unit: DosageUnit;
  targetVolume: number | '';
  volumeUnit: 'm³';
  frequency: DosageFrequency;
  frequencyDays: number | '';
  phDirection: PhCorrectionDirection;
  phEffectMin: number | '';
  phEffectMax: number | '';
}

interface AddProductScreenProps {
  editingManufacturerId?: string | null;
  onSave: () => void;
  onBack: () => void;
}

export const AddProductScreen: React.FC<AddProductScreenProps> = ({
  editingManufacturerId,
  onSave,
  onBack,
}) => {
  // All existing manufacturers from storage
  const [savedManufacturers] = useState<Manufacturer[]>(() => getSavedManufacturers());

  // 1. Manufacturer selection state
  const [selectedExistingMfgId, setSelectedExistingMfgId] = useState<string>(() => {
    if (editingManufacturerId) return editingManufacturerId;
    return '';
  });
  const [isCustomMfgMode, setIsCustomMfgMode] = useState<boolean>(() => {
    return !editingManufacturerId && savedManufacturers.length === 0;
  });
  const [manufacturerName, setManufacturerName] = useState<string>(() => {
    if (editingManufacturerId) {
      const found = savedManufacturers.find((m) => m.id === editingManufacturerId);
      return found ? found.name : '';
    }
    return '';
  });

  // 2. Selected products map (categoryId -> product config)
  const [selectedProducts, setSelectedProducts] = useState<Map<ProductCategoryId, SelectedProductState>>(() => {
    const map = new Map<ProductCategoryId, SelectedProductState>();

    // If editing existing manufacturer, pre-load its saved products
    if (editingManufacturerId) {
      const allProds = getSavedUserProducts();
      const mfgProds = allProds.filter((p) => p.manufacturerId === editingManufacturerId);
      for (const p of mfgProds) {
        const d = p.dosage;
        const dType: DosageType = d.dosageType || (p.categoryId === 'ph_minus' || p.categoryId === 'ph_plus' ? 'ph_correction' : 'standard');
        const phDir: PhCorrectionDirection = d.phDirection || (p.categoryId === 'ph_plus' ? 'increase' : 'decrease');

        map.set(p.categoryId, {
          categoryId: p.categoryId,
          customTitle: p.customTitle,
          dosageType: dType,
          minAmount: d.minAmount !== undefined ? d.minAmount : d.amount,
          maxAmount: d.maxAmount !== undefined && d.maxAmount !== null ? d.maxAmount : '',
          unit: d.unit,
          targetVolume: d.targetVolume,
          volumeUnit: 'm³',
          frequency: d.frequency || (dType === 'ph_correction' ? 'once' : 'weekly'),
          frequencyDays: d.frequencyDays || 7,
          phDirection: phDir,
          phEffectMin: d.phEffectMin !== undefined && d.phEffectMin !== null ? d.phEffectMin : (dType === 'ph_correction' ? 0.10 : ''),
          phEffectMax: d.phEffectMax !== undefined && d.phEffectMax !== null ? d.phEffectMax : '',
        });
      }
    }

    return map;
  });

  // UI state
  const [formError, setFormError] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleConfirmDelete = () => {
    if (editingManufacturerId) {
      deleteManufacturerAndProducts(editingManufacturerId);
      setShowDeleteModal(false);
      onBack();
    }
  };

  // When user picks an existing manufacturer from dropdown
  const handleSelectExistingMfg = (mfgId: string) => {
    if (!mfgId) {
      setSelectedExistingMfgId('');
      return;
    }

    if (mfgId === '__new__') {
      setIsCustomMfgMode(true);
      setSelectedExistingMfgId('');
      setManufacturerName('');
      return;
    }

    const found = savedManufacturers.find((m) => m.id === mfgId);
    if (found) {
      setSelectedExistingMfgId(found.id);
      setManufacturerName(found.name);
      setIsCustomMfgMode(false);

      // Also pre-load products of this manufacturer if any exist
      const allProds = getSavedUserProducts();
      const mfgProds = allProds.filter((p) => p.manufacturerId === found.id);
      if (mfgProds.length > 0) {
        const newMap = new Map<ProductCategoryId, SelectedProductState>();
        for (const p of mfgProds) {
          const d = p.dosage;
          const dType: DosageType = d.dosageType || (p.categoryId === 'ph_minus' || p.categoryId === 'ph_plus' ? 'ph_correction' : 'standard');
          const phDir: PhCorrectionDirection = d.phDirection || (p.categoryId === 'ph_plus' ? 'increase' : 'decrease');

          newMap.set(p.categoryId, {
            categoryId: p.categoryId,
            customTitle: p.customTitle,
            dosageType: dType,
            minAmount: d.minAmount !== undefined ? d.minAmount : d.amount,
            maxAmount: d.maxAmount !== undefined && d.maxAmount !== null ? d.maxAmount : '',
            unit: d.unit,
            targetVolume: d.targetVolume,
            volumeUnit: 'm³',
            frequency: d.frequency || (dType === 'ph_correction' ? 'once' : 'weekly'),
            frequencyDays: d.frequencyDays || 7,
            phDirection: phDir,
            phEffectMin: d.phEffectMin !== undefined && d.phEffectMin !== null ? d.phEffectMin : (dType === 'ph_correction' ? 0.10 : ''),
            phEffectMax: d.phEffectMax !== undefined && d.phEffectMax !== null ? d.phEffectMax : '',
          });
        }
        setSelectedProducts(newMap);
      }
    }
  };

  // Toggle selection of a product category in Step 2
  const handleToggleProduct = (catId: ProductCategoryId) => {
    setSelectedProducts((prev) => {
      const next = new Map<ProductCategoryId, SelectedProductState>(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        const def = PREDEFINED_PRODUCT_TYPES.find((t) => t.id === catId);
        const dType: DosageType = def?.defaultDosageType || (catId === 'ph_minus' || catId === 'ph_plus' ? 'ph_correction' : 'standard');
        const phDir: PhCorrectionDirection = def?.defaultPhDirection || (catId === 'ph_plus' ? 'increase' : 'decrease');

        next.set(catId, {
          categoryId: catId,
          customTitle: '',
          dosageType: dType,
          minAmount: def?.defaultMinAmount ?? def?.defaultAmount ?? 100,
          maxAmount: def?.defaultMaxAmount !== undefined ? def.defaultMaxAmount : '',
          unit: def?.defaultUnit ?? 'g',
          targetVolume: def?.defaultTargetVolume ?? 10,
          volumeUnit: 'm³',
          frequency: def?.defaultFrequency ?? (dType === 'ph_correction' ? 'once' : 'weekly'),
          frequencyDays: def?.defaultFrequencyDays ?? 7,
          phDirection: phDir,
          phEffectMin: def?.defaultPhEffectMin !== undefined ? def.defaultPhEffectMin : (dType === 'ph_correction' ? 0.10 : ''),
          phEffectMax: def?.defaultPhEffectMax !== undefined ? def.defaultPhEffectMax : '',
        });
      }
      return next;
    });
    setFormError(null);
  };

  // Update dosage fields in Step 3 for a selected product
  const handleUpdateDosageField = <K extends keyof SelectedProductState>(
    catId: ProductCategoryId,
    field: K,
    value: SelectedProductState[K]
  ) => {
    setSelectedProducts((prev) => {
      const next = new Map<ProductCategoryId, SelectedProductState>(prev);
      const existing = next.get(catId);
      if (existing) {
        next.set(catId, {
          ...existing,
          [field]: value,
        });
      }
      return next;
    });
    setFormError(null);
  };

  // Remove a product directly from the dosage card
  const handleRemoveSelectedProduct = (catId: ProductCategoryId) => {
    setSelectedProducts((prev) => {
      const next = new Map<ProductCategoryId, SelectedProductState>(prev);
      next.delete(catId);
      return next;
    });
  };

  // Form Validation & Save
  const handleSave = () => {
    setFormError(null);

    // 1. Manufacturer validation
    const trimmedMfgName = manufacturerName.trim();
    if (!trimmedMfgName) {
      setFormError('Molimo unesite ili odaberite naziv proizvođača (npr. BELID d.o.o.).');
      const mfgEl = document.getElementById('input-manufacturer-name');
      mfgEl?.focus();
      return;
    }

    // 2. Selected products validation
    if (selectedProducts.size === 0) {
      setFormError('Molimo odaberite najmanje jedan proizvod sa liste.');
      const prodSec = document.getElementById('section-select-products');
      prodSec?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 3. Dosages validation (mandatory for EVERY selected product)
    const productsDataToSave: Array<{
      categoryId: ProductCategoryId;
      customTitle?: string;
      dosage: ProductDosage;
    }> = [];

    for (const [catId, pState] of selectedProducts.entries()) {
      const def = PREDEFINED_PRODUCT_TYPES.find((t) => t.id === catId);
      const title = def?.title || catId;

      const numMinAmount =
        typeof pState.minAmount === 'number' ? pState.minAmount : parseFloat(pState.minAmount as string);
      const numMaxAmount =
        pState.maxAmount === ''
          ? null
          : typeof pState.maxAmount === 'number'
          ? pState.maxAmount
          : parseFloat(pState.maxAmount as string);
      const numTarget =
        typeof pState.targetVolume === 'number'
          ? pState.targetVolume
          : parseFloat(pState.targetVolume as string);
      const numFreqDays =
        pState.frequencyDays === ''
          ? 7
          : typeof pState.frequencyDays === 'number'
          ? pState.frequencyDays
          : parseInt(pState.frequencyDays as string, 10) || 7;

      if (!numMinAmount || isNaN(numMinAmount) || numMinAmount <= 0) {
        setFormError(`Molimo unesite ispravnu količinu doziranja za proizvod "${title}".`);
        const doseCard = document.getElementById(`dosage-card-${catId}`);
        doseCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (numMaxAmount !== null && (isNaN(numMaxAmount) || numMaxAmount <= 0)) {
        setFormError(`Maksimalna količina za proizvod "${title}" mora biti veći broj ili ostati prazna.`);
        const doseCard = document.getElementById(`dosage-card-${catId}`);
        doseCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (!numTarget || isNaN(numTarget) || numTarget <= 0) {
        setFormError(`Molimo unesite ispravnu zapreminu (m³) za proizvod "${title}".`);
        const doseCard = document.getElementById(`dosage-card-${catId}`);
        doseCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // pH Correction specific validation
      let phEffectMinNum: number | null = null;
      let phEffectMaxNum: number | null = null;
      let phEffectAvgNum: number | null = null;

      if (pState.dosageType === 'ph_correction') {
        phEffectMinNum =
          typeof pState.phEffectMin === 'number'
            ? pState.phEffectMin
            : pState.phEffectMin === ''
            ? null
            : parseFloat(pState.phEffectMin as string);

        phEffectMaxNum =
          typeof pState.phEffectMax === 'number'
            ? pState.phEffectMax
            : pState.phEffectMax === ''
            ? null
            : parseFloat(pState.phEffectMax as string);

        if (!phEffectMinNum || isNaN(phEffectMinNum) || phEffectMinNum <= 0) {
          setFormError(`Molimo unesite učinak na pH (npr. 0.10) za proizvod "${title}".`);
          const doseCard = document.getElementById(`dosage-card-${catId}`);
          doseCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        if (phEffectMaxNum !== null && (isNaN(phEffectMaxNum) || phEffectMaxNum <= 0)) {
          setFormError(`Maksimalni učinak na pH za "${title}" mora biti veći broj ili ostati prazan.`);
          const doseCard = document.getElementById(`dosage-card-${catId}`);
          doseCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        phEffectAvgNum = computePhEffectAverage(phEffectMinNum, phEffectMaxNum);
      }

      const calculatedAmount = computeCalculatorAmount(numMinAmount, numMaxAmount, pState.unit);

      productsDataToSave.push({
        categoryId: catId,
        customTitle: catId === 'other' ? pState.customTitle?.trim() : undefined,
        dosage: {
          dosageType: pState.dosageType,
          minAmount: numMinAmount,
          maxAmount: numMaxAmount,
          amount: calculatedAmount,
          calculatorAmount: calculatedAmount,
          unit: pState.unit,
          targetVolume: numTarget,
          volumeUnit: 'm³',
          frequency: pState.frequency,
          frequencyDays: pState.frequency === 'custom_days' ? numFreqDays : undefined,
          phDirection: pState.dosageType === 'ph_correction' ? pState.phDirection : undefined,
          phEffectMin: pState.dosageType === 'ph_correction' ? phEffectMinNum : undefined,
          phEffectMax: pState.dosageType === 'ph_correction' ? phEffectMaxNum : undefined,
          phEffectAverage: pState.dosageType === 'ph_correction' ? phEffectAvgNum : undefined,
        },
      });
    }

    try {
      saveManufacturerWithProducts({
        manufacturerName: trimmedMfgName,
        existingManufacturerId: selectedExistingMfgId || editingManufacturerId || null,
        productsData: productsDataToSave,
      });

      onSave();
    } catch (err: any) {
      setFormError(err.message || 'Greška pri spremanju proizvoda.');
    }
  };

  // Convert map to array for dosage cards rendering, sorted strictly by global priority (1..11)
  const selectedProductsList = useMemo(() => {
    return sortProductsByGlobalOrder(Array.from(selectedProducts.values()) as SelectedProductState[]);
  }, [selectedProducts]);

  return (
    <div className="w-full min-h-full flex flex-col bg-[#F8FAFC] pb-20 select-none">
      {/* 1. Gornja navigaciona traka (1:1 with GUI Reference) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-add-product-screen"
            type="button"
            onClick={onBack}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none cursor-pointer"
            aria-label="Nazad"
          >
            <ArrowLeft size={22} strokeWidth={2.4} />
          </button>
          <h1 className="text-lg font-bold text-[#0F172A] leading-tight">
            {editingManufacturerId ? 'Uredi proizvod' : 'Dodaj proizvod'}
          </h1>
        </div>

        {/* Akcije na desnoj strani: ✓ (Spremi) i 🗑 (Obriši) */}
        <div className="flex items-center gap-1">
          {/* ✓ Save checkmark button */}
          <button
            id="btn-save-products-top-header"
            type="button"
            onClick={handleSave}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#0062E3] hover:bg-blue-50 active:bg-blue-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Spremi izmjene"
            title="Spremi izmjene"
          >
            <Check size={24} strokeWidth={3} />
          </button>

          {/* 🗑 Delete trash icon */}
          {editingManufacturerId ? (
            <button
              id="btn-delete-product-top-header"
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Obriši proizvod"
              title="Obriši proizvod"
            >
              <Trash2 size={20} strokeWidth={2.2} />
            </button>
          ) : (
            <button
              id="btn-help-product-guide"
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0062E3] hover:bg-blue-50 transition-colors cursor-pointer"
              aria-label="Pomoć oko unosa"
              title="Upute za unos"
            >
              <HelpCircle size={20} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </header>

      {/* Global Form Error Alert */}
      {formError && (
        <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2.5 shadow-xs animate-in fade-in">
          <AlertTriangle size={18} className="flex-shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1 leading-snug">{formError}</div>
        </div>
      )}

      {/* Main Container */}
      <div className="px-4 py-4 space-y-6 max-w-lg mx-auto w-full">
        {/* =========================================================================
            1. PROIZVOĐAČ – PRVI KORAK
            ========================================================================= */}
        <section
          id="section-manufacturer-step"
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3.5"
          aria-labelledby="heading-mfg-step"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0062E3] text-white text-xs font-black flex items-center justify-center shadow-xs">
                1
              </span>
              <h2 id="heading-mfg-step" className="text-base font-black text-[#0F172A] tracking-tight">
                Proizvođač
              </h2>
            </div>
            <Building2 size={18} className="text-slate-400" />
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Unesite ili odaberite naziv proizvođača (npr. <strong className="text-slate-700 font-bold">BELID d.o.o.</strong>). Svi odabrani proizvodi ispod pripadaće ovom proizvođaču.
          </p>

          {/* Dropdown if saved manufacturers exist */}
          {savedManufacturers.length > 0 && !isCustomMfgMode && (
            <div className="space-y-2">
              <label htmlFor="select-existing-mfg" className="block text-xs font-bold text-slate-700">
                Odaberite spremljenog proizvođača:
              </label>
              <div className="relative">
                <select
                  id="select-existing-mfg"
                  value={selectedExistingMfgId}
                  onChange={(e) => handleSelectExistingMfg(e.target.value)}
                  className="w-full appearance-none px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] pr-10 cursor-pointer"
                >
                  <option value="">-- Odaberite proizvođača --</option>
                  {savedManufacturers.map((mfg) => (
                    <option key={mfg.id} value={mfg.id}>
                      {mfg.name}
                    </option>
                  ))}
                  <option value="__new__">+ Dodaj novog proizvođača...</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          )}

          {/* Direct Input Field for Manufacturer Name */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label htmlFor="input-manufacturer-name" className="block text-xs font-bold text-slate-700">
                Naziv proizvođača <span className="text-rose-500">*</span>
              </label>
              {savedManufacturers.length > 0 && isCustomMfgMode && (
                <button
                  type="button"
                  onClick={() => setIsCustomMfgMode(false)}
                  className="text-[11px] font-bold text-[#0062E3] hover:underline cursor-pointer"
                >
                  Odaberi iz liste
                </button>
              )}
            </div>

            <input
              id="input-manufacturer-name"
              type="text"
              value={manufacturerName}
              onChange={(e) => {
                setManufacturerName(e.target.value);
                setFormError(null);
              }}
              placeholder="npr. BELID d.o.o."
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] transition-all shadow-2xs"
            />
          </div>

          {/* Toggle for + Dodaj novog proizvođača if dropdown is active */}
          {savedManufacturers.length > 0 && !isCustomMfgMode && !selectedExistingMfgId && (
            <button
              id="btn-switch-to-new-mfg"
              type="button"
              onClick={() => {
                setIsCustomMfgMode(true);
                setSelectedExistingMfgId('');
                setManufacturerName('');
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-blue-200 hover:border-blue-300 bg-blue-50/40 hover:bg-blue-50 text-[#0062E3] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle size={16} strokeWidth={2.3} />
              <span>+ Dodaj novog proizvođača</span>
            </button>
          )}
        </section>

        {/* =========================================================================
            2. ODABERITE PROIZVODE – DRUGI KORAK
            ========================================================================= */}
        <section
          id="section-select-products"
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4"
          aria-labelledby="heading-products-step"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0062E3] text-white text-xs font-black flex items-center justify-center shadow-xs">
                2
              </span>
              <h2 id="heading-products-step" className="text-base font-black text-[#0F172A] tracking-tight">
                Odaberite proizvode
              </h2>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0062E3]">
              Odabrano: {selectedProducts.size}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Kliknite na proizvode proizvođača <strong className="text-slate-700 font-bold">{manufacturerName.trim() || 'kojeg unosite'}</strong> koje koristite:
          </p>

          {/* Product Grid with Distinct Icons & Selected States */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
            {PREDEFINED_PRODUCT_TYPES.map((type) => {
              const isSelected = selectedProducts.has(type.id);

              return (
                <button
                  key={type.id}
                  id={`btn-toggle-product-${type.id}`}
                  type="button"
                  onClick={() => handleToggleProduct(type.id)}
                  className={`relative p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[110px] ${
                    isSelected
                      ? 'bg-blue-50/80 border-2 border-[#0062E3] shadow-sm shadow-blue-500/15 ring-2 ring-blue-500/10'
                      : 'bg-[#F8FAFC] border-slate-200/80 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {/* Top row: Product Icon & Checkbox */}
                  <div className="flex items-start justify-between w-full mb-2">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-2xs flex items-center justify-center flex-shrink-0 p-1">
                      <ProductIcon categoryId={type.id} size={40} />
                    </div>

                    {/* Checkbox state */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#0062E3] text-white shadow-xs'
                          : 'border-2 border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={3.5} />}
                    </div>
                  </div>

                  {/* Product Title */}
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      isSelected ? 'text-[#0062E3]' : 'text-slate-800'
                    }`}
                  >
                    {type.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            3. PODACI O DOZIRANJU – TREĆI KORAK (Standard, Korekcija pH, Korekcija hlora)
            ========================================================================= */}
        <section
          id="section-dosage-step"
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4"
          aria-labelledby="heading-dosage-step"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0062E3] text-white text-xs font-black flex items-center justify-center shadow-xs">
                3
              </span>
              <h2 id="heading-dosage-step" className="text-base font-black text-[#0F172A] tracking-tight">
                Doziranje
              </h2>
            </div>
            {selectedProducts.size > 0 && (
              <span className="text-xs text-slate-500 font-semibold">
                {selectedProducts.size} {selectedProducts.size === 1 ? 'proizvod' : 'proizvoda'}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Prepišite podatke sa deklaracije proizvođača. Ekran služi isključivo za unos i čuvanje podataka sa ambalaže/deklaracije.
          </p>

          {/* If 0 products selected */}
          {selectedProducts.size === 0 ? (
            <div className="py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
              <Info size={24} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-700">
                Niste odabrali niti jedan proizvod
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Kliknite na proizvode u sekciji <strong className="text-slate-700 font-bold">2. Odaberite proizvode</strong> iznad.
              </p>
            </div>
          ) : (
            /* Dedicated dosage card per selected product */
            <div className="space-y-4">
              {selectedProductsList.map((pState) => {
                const def = PREDEFINED_PRODUCT_TYPES.find((t) => t.id === pState.categoryId);
                const title = def?.title || pState.categoryId;

                const numMin =
                  typeof pState.minAmount === 'number'
                    ? pState.minAmount
                    : parseFloat(pState.minAmount as string) || 0;
                const numMax =
                  pState.maxAmount === ''
                    ? null
                    : typeof pState.maxAmount === 'number'
                    ? pState.maxAmount
                    : parseFloat(pState.maxAmount as string) || null;
                const numTarget =
                  typeof pState.targetVolume === 'number'
                    ? pState.targetVolume
                    : parseFloat(pState.targetVolume as string) || 0;
                const numDays =
                  typeof pState.frequencyDays === 'number'
                    ? pState.frequencyDays
                    : parseInt(pState.frequencyDays as string, 10) || 7;

                // Live calculated calculator amount
                const autoCalcAmount = computeCalculatorAmount(numMin, numMax, pState.unit);

                const isRange = numMax !== null && numMax > 0 && numMax !== numMin;
                const isTablets = pState.unit === 'tableta' || pState.unit === 'komad';

                // pH calculation parameters
                const numPhMin =
                  typeof pState.phEffectMin === 'number'
                    ? pState.phEffectMin
                    : parseFloat(pState.phEffectMin as string) || 0;
                const numPhMax =
                  pState.phEffectMax === ''
                    ? null
                    : typeof pState.phEffectMax === 'number'
                    ? pState.phEffectMax
                    : parseFloat(pState.phEffectMax as string) || null;
                const isPhRange = numPhMax !== null && numPhMax > 0 && numPhMax !== numPhMin;

                return (
                  <div
                    key={pState.categoryId}
                    id={`dosage-card-${pState.categoryId}`}
                    className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-xs space-y-4 relative"
                  >
                    {/* Header: Icon + Product Title + Remove button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center flex-shrink-0 p-1">
                          <ProductIcon categoryId={pState.categoryId} size={36} />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-[#0F172A] leading-tight">
                            {title}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {manufacturerName.trim() || 'Proizvođač'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSelectedProduct(pState.categoryId)}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                        title="Ukloni ovaj proizvod"
                      >
                        <Trash2 size={16} strokeWidth={2.2} />
                      </button>
                    </div>

                    {/* If "Ostalo", allow typing custom title/description */}
                    {pState.categoryId === 'other' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Naziv / opis ovog sredstva:
                        </label>
                        <input
                          type="text"
                          value={pState.customTitle || ''}
                          onChange={(e) =>
                            handleUpdateDosageField(pState.categoryId, 'customTitle', e.target.value)
                          }
                          placeholder="npr. Sredstvo za čišćenje linije vode"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3]"
                        />
                      </div>
                    )}

                    {/* =====================================================================
                        ODABIR TIPA DOZIRANJA / DJELOVANJA
                        ===================================================================== */}
                    <div className="pt-0.5 border-t border-slate-200/70 space-y-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Tip doziranja / djelovanja
                      </label>
                      <div className="relative">
                        <select
                          value={pState.dosageType}
                          onChange={(e) => {
                            const newType = e.target.value as DosageType;
                            handleUpdateDosageField(pState.categoryId, 'dosageType', newType);
                            // Set suitable default units/frequency if switching to pH correction
                            if (newType === 'ph_correction') {
                              if (pState.categoryId === 'ph_plus') {
                                handleUpdateDosageField(pState.categoryId, 'phDirection', 'increase');
                              } else {
                                handleUpdateDosageField(pState.categoryId, 'phDirection', 'decrease');
                              }
                              if (pState.phEffectMin === '') {
                                handleUpdateDosageField(pState.categoryId, 'phEffectMin', 0.10);
                              }
                            }
                          }}
                          className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-[#0062E3] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] pr-9 cursor-pointer shadow-2xs"
                        >
                          <option value="standard">Standardno doziranje</option>
                          <option value="ph_correction">Korekcija pH</option>
                          <option value="chlorine_correction">Korekcija hlora</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* =====================================================================
                        1. VARIJANTA: KOREKCIJA pH
                        ===================================================================== */}
                    {pState.dosageType === 'ph_correction' ? (
                      <div className="space-y-4 pt-1">
                        {/* A. Smjer korekcije */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Smjer korekcije <span className="text-rose-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateDosageField(pState.categoryId, 'phDirection', 'decrease')}
                              className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                pState.phDirection === 'decrease'
                                  ? 'bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-400/20 shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>🔻 Snižava pH (pH-)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateDosageField(pState.categoryId, 'phDirection', 'increase')}
                              className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                pState.phDirection === 'increase'
                                  ? 'bg-blue-50 border-blue-300 text-[#0062E3] ring-2 ring-blue-400/20 shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>🔺 Povećava pH (pH+)</span>
                            </button>
                          </div>
                        </div>

                        {/* B. Doza proizvoda (Količina) */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Doza proizvoda <span className="text-rose-500">*</span>
                          </label>

                          <div className="flex items-center gap-2">
                            {/* Min amount */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="number"
                                step="any"
                                min="0.01"
                                value={pState.minAmount === '' ? '' : pState.minAmount}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'minAmount',
                                    isNaN(val as number) ? '' : val
                                  );
                                }}
                                placeholder="0.1"
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] shadow-2xs"
                              />
                            </div>

                            {/* "do" label */}
                            <span className="text-xs font-bold text-slate-400 px-0.5 select-none">
                              do
                            </span>

                            {/* Max amount (optional) */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="number"
                                step="any"
                                min="0.01"
                                value={pState.maxAmount === '' ? '' : pState.maxAmount}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'maxAmount',
                                    isNaN(val as number) ? '' : val
                                  );
                                }}
                                placeholder="(opcionalno)"
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] shadow-2xs"
                              />
                            </div>

                            {/* Unit selector */}
                            <div className="w-24 flex-shrink-0">
                              <select
                                value={pState.unit}
                                onChange={(e) =>
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'unit',
                                    e.target.value as DosageUnit
                                  )
                                }
                                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] cursor-pointer"
                              >
                                <option value="l">l</option>
                                <option value="ml">ml</option>
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="tableta">tableta</option>
                                <option value="komad">komad</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* C. Na zapreminu & Učestalost */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Na zapreminu (m³) */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Na zapreminu <span className="text-rose-500">*</span>
                            </label>
                            <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-[#0062E3] shadow-2xs">
                              <input
                                type="number"
                                step="any"
                                min="0.1"
                                value={pState.targetVolume === '' ? '' : pState.targetVolume}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'targetVolume',
                                    isNaN(val as number) ? '' : val
                                  );
                                }}
                                placeholder="10"
                                className="w-full px-3 py-2.5 text-xs font-extrabold text-slate-900 focus:outline-none"
                              />
                              <div className="bg-slate-100 border-l border-slate-200 px-3 py-2.5 text-xs font-extrabold text-slate-700 flex items-center">
                                m³
                              </div>
                            </div>
                          </div>

                          {/* Učestalost */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Učestalost
                            </label>
                            <div className="relative">
                              <select
                                value={pState.frequency}
                                onChange={(e) =>
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'frequency',
                                    e.target.value as DosageFrequency
                                  )
                                }
                                className="w-full appearance-none px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] pr-8 cursor-pointer shadow-2xs"
                              >
                                <option value="once">Po potrebi / Jednokratno</option>
                                <option value="daily">Dnevno</option>
                                <option value="weekly">Sedmično</option>
                                <option value="custom_days">Svakih X dana</option>
                                <option value="monthly">Mjesečno</option>
                              </select>
                              <ChevronDown
                                size={16}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* D. Učinak na pH (Raspon: min do max) */}
                        <div className="space-y-1.5 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-800">
                              Učinak na pH <span className="text-rose-500">*</span>
                            </label>
                            <span className="text-[10px] font-bold text-slate-500">
                              (za koliko mijenja pH vrijednost)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Min pH effect */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                max="2.0"
                                value={pState.phEffectMin === '' ? '' : pState.phEffectMin}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'phEffectMin',
                                    isNaN(val as number) ? '' : val
                                  );
                                }}
                                placeholder="0.10"
                                className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] shadow-2xs"
                              />
                            </div>

                            <span className="text-xs font-bold text-slate-400 px-0.5 select-none">
                              do
                            </span>

                            {/* Max pH effect (optional) */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                max="2.0"
                                value={pState.phEffectMax === '' ? '' : pState.phEffectMax}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'phEffectMax',
                                    isNaN(val as number) ? '' : val
                                  );
                                }}
                                placeholder="0.15 (opcionalno)"
                                className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs font-extrabold text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] shadow-2xs"
                              />
                            </div>
                          </div>
                        </div>

                        {/* E. Sažetak deklaracije sa ambalaže (Read-only) */}
                        <div className="pt-3 border-t border-slate-200/80 bg-white/70 -mx-4 -mb-4 p-4 rounded-b-2xl space-y-2 border-b">
                          <div className="flex items-center gap-1.5">
                            <Sparkles size={15} className="text-[#0062E3]" />
                            <span className="text-xs font-bold text-[#0F172A]">
                              Deklaracija proizvođača:
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 space-y-1">
                            <p className="text-xs font-bold text-[#0062E3] leading-snug">
                              {pState.minAmount || '0'}
                              {pState.maxAmount && pState.maxAmount > 0 ? `–${pState.maxAmount}` : ''}{' '}
                              {pState.unit} na {pState.targetVolume || '10'} m³ vode{' '}
                              {pState.phDirection === 'increase' ? 'povećava' : 'snižava'} pH za{' '}
                              {pState.phEffectMin || '0.10'}
                              {pState.phEffectMax && pState.phEffectMax > 0 ? `–${pState.phEffectMax}` : ''}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              Ovi podaci sa deklaracije biće sačuvani za automatski Kalkulator hemije.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* =====================================================================
                          2. VARIJANTA: STANDARDNO DOZIRANJE / HLOR
                          ===================================================================== */
                      <div className="space-y-4 pt-1">
                        {/* Količina (Raspon: [min] do [max] [jedinica]) */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Količina <span className="text-rose-500">*</span>
                          </label>

                          <div className="flex items-center gap-2">
                            {/* Min amount input */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="number"
                                step="any"
                                min="0.1"
                                value={pState.minAmount === '' ? '' : pState.minAmount}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'minAmount',
                                    isNaN(val as number) ? '' : val
                                  );
                                }}
                                placeholder="50"
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] shadow-2xs"
                              />
                            </div>

                            {/* "do" separator label */}
                            <span className="text-xs font-bold text-slate-400 px-0.5 select-none">
                              do
                            </span>

                            {/* Max amount input (optional) */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="number"
                                step="any"
                                min="0.1"
                                value={pState.maxAmount === '' ? '' : pState.maxAmount}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'maxAmount',
                                    isNaN(val as number) ? '' : val
                                  );
                                }}
                                placeholder="(opcionalno)"
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] shadow-2xs"
                              />
                            </div>

                            {/* Unit dropdown */}
                            <div className="w-24 flex-shrink-0">
                              <select
                                value={pState.unit}
                                onChange={(e) =>
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'unit',
                                    e.target.value as DosageUnit
                                  )
                                }
                                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] cursor-pointer"
                              >
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="tableta">tableta</option>
                                <option value="komad">komad</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Na zapreminu & Učestalost */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Na zapreminu (m³) */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Na zapreminu <span className="text-rose-500">*</span>
                            </label>
                            <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-[#0062E3] shadow-2xs">
                              <input
                                type="number"
                                step="any"
                                min="0.1"
                                value={pState.targetVolume === '' ? '' : pState.targetVolume}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'targetVolume',
                                    isNaN(val as number) ? '' : val
                                  );
                                }}
                                placeholder="10"
                                className="w-full px-3 py-2.5 text-xs font-extrabold text-slate-900 focus:outline-none"
                              />
                              <div className="bg-slate-100 border-l border-slate-200 px-3 py-2.5 text-xs font-extrabold text-slate-700 flex items-center">
                                m³
                              </div>
                            </div>
                          </div>

                          {/* Učestalost dropdown */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Učestalost
                            </label>
                            <div className="relative">
                              <select
                                value={pState.frequency}
                                onChange={(e) =>
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'frequency',
                                    e.target.value as DosageFrequency
                                  )
                                }
                                className="w-full appearance-none px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062E3] pr-8 cursor-pointer shadow-2xs"
                              >
                                <option value="weekly">Sedmično</option>
                                <option value="daily">Dnevno</option>
                                <option value="once">Jednokratno</option>
                                <option value="custom_days">Svakih X dana</option>
                                <option value="monthly">Mjesečno</option>
                              </select>
                              <ChevronDown
                                size={16}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* If "Svakih X dana" selected: Show days input */}
                        {pState.frequency === 'custom_days' && (
                          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                              <Calendar size={16} className="text-[#0062E3]" />
                              <span>Ponavljanje:</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-600 font-medium">Svakih</span>
                              <input
                                type="number"
                                min="1"
                                max="365"
                                value={pState.frequencyDays === '' ? '' : pState.frequencyDays}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                                  handleUpdateDosageField(
                                    pState.categoryId,
                                    'frequencyDays',
                                    isNaN(val as number) ? '' : val
                                  );
                                }}
                                placeholder="7"
                                className="w-16 py-1.5 px-2.5 bg-white border border-blue-200 rounded-lg text-xs font-bold text-center text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="text-xs text-slate-600 font-medium">dana</span>
                            </div>
                          </div>
                        )}

                        {/* =========================================================================
                            AUTOMATSKA KALKULATORSKA VRIJEDNOST (Read-Only)
                            ========================================================================= */}
                        <div className="pt-3 border-t border-slate-200/80 bg-white/70 -mx-4 -mb-4 p-4 rounded-b-2xl space-y-2 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Calculator size={15} className="text-[#0062E3]" />
                              <span className="text-xs font-bold text-[#0F172A]">
                                Kalkulatorska vrijednost:
                              </span>
                            </div>
                            <span className="text-xs font-extrabold text-[#0062E3] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                              {autoCalcAmount || '0'} {pState.unit} / {pState.targetVolume || '0'} m³
                            </span>
                          </div>

                          {/* Formula & Range badge */}
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>
                              {isRange ? (
                                <>
                                  Sredina raspona ({numMin} + {numMax}) / 2 = {autoCalcAmount}{' '}
                                  {isTablets && (numMin + (numMax || 0)) % 2 !== 0 ? '(zaokruženo)' : ''}
                                </>
                              ) : (
                                'Fiksna doza sa deklaracije'
                              )}
                            </span>
                            <span className="text-slate-400 font-medium">
                              {formatFrequencyLabel(pState.frequency, numDays)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          id="modal-delete-product-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            id="modal-delete-product-dialog"
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="dialog-delete-product-title"
            aria-describedby="dialog-delete-product-desc"
          >
            {/* Warning Icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-100">
              <Trash2 size={28} strokeWidth={2.2} />
            </div>

            {/* Title */}
            <h3
              id="dialog-delete-product-title"
              className="text-lg font-black text-[#0F172A] tracking-tight"
            >
              Izbrisati proizvod?
            </h3>

            {/* Description */}
            <p
              id="dialog-delete-product-desc"
              className="text-xs font-normal text-slate-500 mt-2 leading-relaxed max-w-xs"
            >
              Da li ste sigurni da želite obrisati{' '}
              <strong className="text-slate-700 font-bold">
                "{manufacturerName.trim() || 'ovog proizvođača'}"
              </strong>{' '}
              i sve pridružene proizvode?
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 w-full mt-6">
              <button
                id="btn-cancel-delete-product"
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer focus:outline-none"
              >
                Otkaži
              </button>

              <button
                id="btn-confirm-delete-product"
                type="button"
                onClick={handleConfirmDelete}
                className="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-md shadow-red-600/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Izbriši
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#0062E3]">
                <HelpCircle size={22} strokeWidth={2.4} />
                <h3 className="text-base font-black text-[#0F172A]">
                  Upute za unos deklaracije
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                Jednostavno prepišite vrijednosti sa ambalaže / deklaracije proizvoda:
              </p>
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 space-y-2 text-slate-700">
                <p>
                  <strong>• Standardno doziranje:</strong> Unesite raspon (npr. <span className="font-bold text-[#0062E3]">50–100 ml</span>) ili fiksnu dozu. Aplikacija automatski računa kalkulatorsku vrijednost.
                </p>
                <p>
                  <strong>• Korekcija pH:</strong> Odaberite smjer (Snižava pH ili Povećava pH), dozu (npr. 0.1 L na 10 m³) i učinak na pH sa deklaracije (npr. 0.10 do 0.15).
                </p>
                <p>
                  <strong>• Učestalost:</strong> Odaberite da li se sredstvo dodaje po potrebi, sedmično, dnevno ili svakih X dana.
                </p>
              </div>
              <p className="text-slate-500 text-[11px]">
                Ekran služi isključivo za unos deklaracije. Kalkulator hemije će sam proračunati tačnu dozu za vaš bazen.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full mt-4 py-3 rounded-xl bg-[#0062E3] text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Razumijem
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
