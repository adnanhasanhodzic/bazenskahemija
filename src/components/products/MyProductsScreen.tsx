import React, { useState } from 'react';
import {
  PlusCircle,
  Package,
  Pencil,
  Trash2,
  ArrowLeft,
  Info,
  AlertTriangle,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { UserProduct, Manufacturer, ManufacturerGroup } from '../../types/product';
import { ProductIcon } from './ProductIcons';
import {
  getGroupedManufacturers,
  deleteManufacturerAndProducts,
  deleteUserProduct,
  formatFrequencyLabel,
} from '../../utils/productStorage';

interface MyProductsScreenProps {
  onAddNewProduct: () => void;
  onEditManufacturer: (manufacturerId: string) => void;
  onEditProduct: (categoryId: string) => void;
  onBack?: () => void;
}

export const MyProductsScreen: React.FC<MyProductsScreenProps> = ({
  onAddNewProduct,
  onEditManufacturer,
  onEditProduct,
  onBack,
}) => {
  // Groups data (strictly organized by manufacturer)
  const [mfgGroups, setMfgGroups] = useState<ManufacturerGroup[]>(() =>
    getGroupedManufacturers()
  );

  // Accordion state: manufacturer ID -> boolean (closed by default)
  const [expandedMfgIds, setExpandedMfgIds] = useState<Record<string, boolean>>({});

  // Modal deletion states
  const [mfgToDelete, setMfgToDelete] = useState<Manufacturer | null>(null);
  const [productToDelete, setProductToDelete] = useState<UserProduct | null>(null);

  // Refresh data after deletion
  const refreshData = () => {
    setMfgGroups(getGroupedManufacturers());
  };

  // Toggle open/close of a manufacturer accordion
  const toggleManufacturer = (mfgId: string) => {
    setExpandedMfgIds((prev) => ({
      ...prev,
      [mfgId]: !prev[mfgId],
    }));
  };

  // Total products count across all manufacturers
  const totalProductsCount = mfgGroups.reduce((acc, g) => acc + g.products.length, 0);

  // Handle delete of entire manufacturer and all its products
  const handleConfirmDeleteManufacturer = () => {
    if (!mfgToDelete) return;
    deleteManufacturerAndProducts(mfgToDelete.id);
    refreshData();
    setMfgToDelete(null);
  };

  // Handle delete of a single product
  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;
    deleteUserProduct(productToDelete.id);
    refreshData();
    setProductToDelete(null);
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-[#F8FAFC] dark:bg-slate-900 pb-20 select-none transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 py-3.5 flex items-center justify-between shadow-xs transition-colors">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              id="btn-back-products-header"
              type="button"
              onClick={onBack}
              className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Nazad"
            >
              <ArrowLeft size={20} strokeWidth={2.4} />
            </button>
          )}
          <h1 className="text-lg font-black text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
            <span>Moji proizvodi</span>
            {totalProductsCount > 0 && (
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#0062E3] dark:text-blue-400">
                {totalProductsCount}
              </span>
            )}
          </h1>
        </div>

        {/* Top + Dodaj proizvode button */}
        {totalProductsCount > 0 && (
          <button
            id="btn-top-add-products"
            type="button"
            onClick={onAddNewProduct}
            className="py-2 px-3.5 rounded-xl bg-[#0062E3] hover:bg-[#0052C4] active:scale-[0.97] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
          >
            <PlusCircle size={16} strokeWidth={2.4} />
            <span>Dodaj proizvode</span>
          </button>
        )}
      </header>

      {/* Main Screen Container */}
      <div className="px-4 py-4 max-w-lg mx-auto w-full flex-1 flex flex-col space-y-3.5">
        {/* =========================================================================
            1. EMPTY STATE (When 0 manufacturers/products are saved)
            ========================================================================= */}
        {mfgGroups.length === 0 || totalProductsCount === 0 ? (
          <div
            id="card-products-empty-state"
            className="my-auto py-12 px-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm flex flex-col items-center text-center transition-colors"
          >
            {/* Visual Icon */}
            <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-800 shadow-xs">
              <Package size={42} strokeWidth={1.8} className="text-[#0062E3] dark:text-blue-400" />
            </div>

            <h2 className="text-xl font-black text-[#0F172A] dark:text-white tracking-tight mb-1.5">
              Još niste unijeli proizvode
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-6">
              Odaberite ili dodajte proizvođača i unesite hemijska sredstva koja koristite za održavanje bazena sa tačnim doziranjem sa deklaracije.
            </p>

            {/* Primary CTA Button */}
            <button
              id="btn-empty-add-products"
              type="button"
              onClick={onAddNewProduct}
              className="w-full max-w-xs py-3.5 px-6 rounded-2xl bg-[#0062E3] hover:bg-[#0052C4] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <PlusCircle size={20} strokeWidth={2.4} />
              <span>+ Dodaj proizvode</span>
            </button>

            {/* Info notice */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
              <Info size={15} />
              <span>Proizvodi su organizovani po proizvođačima u fiksnom redoslijedu</span>
            </div>
          </div>
        ) : (
          /* =========================================================================
              2. MANUFACTURERS LIST (Accordion: click to expand / collapse)
              ========================================================================= */
          <div className="space-y-3">
            {mfgGroups.map((group) => {
              const isExpanded = !!expandedMfgIds[group.manufacturer.id];
              const pCount = group.products.length;

              return (
                <div
                  key={group.manufacturer.id}
                  id={`mfg-card-${group.manufacturer.id}`}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs overflow-hidden transition-all duration-200"
                >
                  {/* Header / Clickable Accordion Bar */}
                  <div
                    onClick={() => toggleManufacturer(group.manufacturer.id)}
                    className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-750 transition-colors"
                  >
                    {/* Left: Icon + Manufacturer Name + Count */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                        <Building2 size={20} strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-white tracking-tight truncate">
                          {group.manufacturer.name}
                        </h2>
                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {pCount} {pCount === 1 ? 'proizvod' : 'proizvoda'}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions (Edit, Delete) + Chevron */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Edit Manufacturer */}
                      <button
                        id={`btn-edit-mfg-${group.manufacturer.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditManufacturer(group.manufacturer.id);
                        }}
                        className="p-1.5 rounded-xl text-slate-400 dark:text-slate-400 hover:text-[#0062E3] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                        title="Uredi proizvođača i proizvode"
                      >
                        <Pencil size={15} strokeWidth={2.2} />
                      </button>

                      {/* Delete Manufacturer */}
                      <button
                        id={`btn-delete-mfg-${group.manufacturer.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMfgToDelete(group.manufacturer);
                        }}
                        className="p-1.5 rounded-xl text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Obriši proizvođača"
                      >
                        <Trash2 size={15} strokeWidth={2.2} />
                      </button>

                      {/* Expand/Collapse Chevron */}
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-[#0062E3] dark:text-blue-400' : 'rotate-0'
                        }`}
                      >
                        <ChevronDown size={18} strokeWidth={2.4} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Products List (Strictly ordered by Global Fixed Priority 1..11) */}
                  {isExpanded && (
                    <div className="px-3.5 pb-4 pt-1 border-t border-slate-100 dark:border-slate-700/60 space-y-2.5">
                      {group.products.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                          Nema unesenih proizvoda za ovog proizvođača.
                        </div>
                      ) : (
                        <div className="space-y-2 pt-2">
                          {group.products.map((product) => {
                            const dose = product.dosage;

                            return (
                              <div
                                key={product.id}
                                id={`product-item-${product.id}`}
                                className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-750/70 border border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-between gap-3"
                              >
                                {/* Left: Product Icon + Title + Dosage */}
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 shadow-2xs flex items-center justify-center flex-shrink-0 p-1">
                                    <ProductIcon categoryId={product.categoryId} size={32} />
                                  </div>

                                  <div className="min-w-0">
                                    <h3 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-white truncate">
                                      {product.customTitle || product.categoryTitle}
                                    </h3>

                                    {/* Dosage info badge */}
                                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                      {dose.maxAmount && dose.maxAmount > dose.minAmount ? (
                                        <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#0062E3] dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 font-extrabold text-[10px] sm:text-[11px]">
                                          {dose.minAmount}–{dose.maxAmount} {dose.unit} / {dose.targetVolume} {dose.volumeUnit}
                                        </span>
                                      ) : (
                                        <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#0062E3] dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 font-extrabold text-[10px] sm:text-[11px]">
                                          {dose.minAmount || dose.amount} {dose.unit} / {dose.targetVolume} {dose.volumeUnit}
                                        </span>
                                      )}

                                      {/* pH effect badge if pH correction */}
                                      {dose.dosageType === 'ph_correction' && dose.phEffectMin && (
                                        <span
                                          className={`inline-block px-2 py-0.5 rounded-md font-extrabold text-[10px] sm:text-[11px] border ${
                                            dose.phDirection === 'increase'
                                              ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0062E3] dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                          }`}
                                        >
                                          {dose.phDirection === 'increase' ? '🔺 +' : '🔻 -'}
                                          {dose.phEffectMin}
                                          {dose.phEffectMax && dose.phEffectMax > dose.phEffectMin
                                            ? `–${dose.phEffectMax}`
                                            : ''}{' '}
                                          pH
                                        </span>
                                      )}

                                      {dose.frequency && (
                                        <span className="inline-block px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px]">
                                          {formatFrequencyLabel(dose.frequency, dose.frequencyDays)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Right: Edit + Delete single product buttons */}
                                <button
                                  id={`btn-edit-product-${product.id}`}
                                  type="button"
                                  onClick={() => onEditProduct(product.categoryId)}
                                  className="w-8 h-8 rounded-xl text-slate-400 hover:text-[#0062E3] hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                                  title="Uredi doziranje ovog proizvoda"
                                  aria-label="Uredi doziranje proizvoda"
                                >
                                  <Pencil size={14} strokeWidth={2.2} />
                                </button>

                                {/* Right: Delete single product button */}
                                <button
                                  id={`btn-delete-product-${product.id}`}
                                  type="button"
                                  onClick={() => setProductToDelete(product)}
                                  className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                                  title="Obriši ovaj proizvod"
                                >
                                  <Trash2 size={14} strokeWidth={2.2} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          DELETE MANUFACTURER CONFIRMATION MODAL
          ========================================================================= */}
      {mfgToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} strokeWidth={2.4} />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A] dark:text-white leading-tight">
                  Obriši proizvođača?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Ova radnja je nepovratna.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Da li ste sigurni da želite obrisati proizvođača{' '}
              <strong className="text-slate-900 dark:text-white font-bold">{mfgToDelete.name}</strong>?
              <br />
              <span className="text-rose-600 dark:text-rose-400 font-semibold mt-1 block">
                Upozorenje: Svi proizvodi ovog proizvođača će takođe biti obrisani.
              </span>
            </p>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setMfgToDelete(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              >
                Odustani
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteManufacturer}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Obriši sve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE SINGLE PRODUCT CONFIRMATION MODAL
          ========================================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={22} strokeWidth={2.4} />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A] dark:text-white leading-tight">
                  Obriši proizvod?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Ova radnja je nepovratna.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Da li ste sigurni da želite obrisati proizvod{' '}
              <strong className="text-slate-900 dark:text-white font-bold">
                {productToDelete.customTitle || productToDelete.categoryTitle}
              </strong>{' '}
              od proizvođača{' '}
              <strong className="text-slate-900 dark:text-white font-bold">
                {productToDelete.manufacturerName}
              </strong>
              ?
            </p>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              >
                Odustani
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

