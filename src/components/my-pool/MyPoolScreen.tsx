import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  Waves,
  PlusCircle,
  ArrowLeft,
} from 'lucide-react';
import { Pool } from '../../types/pool';
import { PoolThumbnailIcon } from '../home/PoolThumbnailIcon';
import { PoolFormEditor } from './PoolFormEditor';
import { DeletePoolModal } from './DeletePoolModal';
import { formatLiters } from '../../utils/poolCalculations';
import {
  saveOrUpdatePool,
  deletePool as deletePoolFromStorage,
  setActivePoolId,
} from '../../utils/poolStorage';

interface MyPoolScreenProps {
  pools: Pool[];
  activePoolId: string | null;
  onPoolsChanged: (pools: Pool[], activeId: string | null) => void;
  onBackToHome?: () => void;
  // If parent wants to initiate edit or add immediately:
  initialEditorMode?: 'add' | 'edit' | null;
  editingPoolId?: string | null;
}

export const MyPoolScreen: React.FC<MyPoolScreenProps> = ({
  pools,
  activePoolId,
  onPoolsChanged,
  onBackToHome,
  initialEditorMode = null,
  editingPoolId = null,
}) => {
  // Mode: 'list' | 'add' | 'edit'
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>(() => {
    if (initialEditorMode) return initialEditorMode;
    return 'list';
  });

  const [selectedPoolForEdit, setSelectedPoolForEdit] = useState<Pool | null>(() => {
    if (editingPoolId) {
      return pools.find((p) => p.id === editingPoolId) || null;
    }
    return null;
  });

  // Delete modal state
  const [poolToDelete, setPoolToDelete] = useState<Pool | null>(null);

  const handleOpenAdd = () => {
    setSelectedPoolForEdit(null);
    setMode('add');
  };

  const handleOpenEdit = (pool: Pool) => {
    setSelectedPoolForEdit(pool);
    setMode('edit');
  };

  const handleSetActive = (poolId: string) => {
    setActivePoolId(poolId);
    onPoolsChanged(pools, poolId);
  };

  const handleSavePool = (
    poolData: Omit<Pool, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const isEdit = Boolean(poolData.id);
    const poolToSave: Pool = {
      id: poolData.id || `pool_${Date.now()}`,
      name: poolData.name,
      shape: poolData.shape,
      diameter: poolData.diameter,
      length: poolData.length,
      width: poolData.width,
      height: poolData.height,
      fillPercentage: poolData.fillPercentage,
      totalVolumeLiters: poolData.totalVolumeLiters,
      workingVolumeLiters: poolData.workingVolumeLiters,
      createdAt: isEdit
        ? pools.find((p) => p.id === poolData.id)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { pools: updatedPools, activePoolId: newActiveId } =
      saveOrUpdatePool(poolToSave);
    onPoolsChanged(updatedPools, newActiveId);
    setMode('list');
    setSelectedPoolForEdit(null);
  };

  const handleDeleteRequest = (pool: Pool) => {
    setPoolToDelete(pool);
  };

  const handleConfirmDelete = () => {
    if (!poolToDelete) return;

    const { pools: updatedPools, newActivePoolId } = deletePoolFromStorage(
      poolToDelete.id
    );
    onPoolsChanged(updatedPools, newActivePoolId);
    setPoolToDelete(null);

    // If we were editing the pool that got deleted, switch back to list
    if (mode === 'edit' && selectedPoolForEdit?.id === poolToDelete.id) {
      setMode('list');
      setSelectedPoolForEdit(null);
    }
  };

  // If in Add or Edit mode, show PoolFormEditor
  if (mode === 'add' || mode === 'edit') {
    return (
      <>
        <PoolFormEditor
          initialPool={mode === 'edit' ? selectedPoolForEdit : null}
          onBack={() => {
            if (pools.length === 0 && onBackToHome) {
              onBackToHome();
            } else {
              setMode('list');
              setSelectedPoolForEdit(null);
            }
          }}
          onSave={handleSavePool}
          onDeleteRequest={mode === 'edit' ? handleDeleteRequest : undefined}
        />
        <DeletePoolModal
          isOpen={Boolean(poolToDelete)}
          poolName={poolToDelete?.name || ''}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPoolToDelete(null)}
        />
      </>
    );
  }

  // LIST OF SAVED POOLS (Moji bazeni)
  return (
    <div className="w-full flex flex-col bg-white dark:bg-slate-900 min-h-full pb-12 select-none transition-colors">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-5 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button
              id="btn-back-to-home"
              type="button"
              onClick={onBackToHome}
              className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
              aria-label="Početna"
            >
              <ArrowLeft size={20} strokeWidth={2.2} />
            </button>
          )}
          <h1 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white tracking-tight">
            Moji bazeni
          </h1>
          {pools.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800">
              {pools.length}
            </span>
          )}
        </div>

        {/* 1. JEDINO GORNJE DUGME: Dodaj bazen (Prikazuje se kada korisnik ima bazene) */}
        {pools.length > 0 && (
          <button
            id="btn-top-add-new-pool"
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0062E3] hover:bg-[#0052C4] active:scale-[0.98] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer focus:outline-none"
          >
            <Plus size={15} strokeWidth={2.8} />
            <span>Dodaj bazen</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 flex flex-col space-y-4 max-w-lg mx-auto w-full">
        {pools.length === 0 ? (
          /* 5. EMPTY STATE: Jedna jasna opcija za dodavanje prvog bazena */
          <div
            id="empty-state-my-pools"
            className="w-full bg-slate-50/80 dark:bg-slate-800/80 rounded-3xl p-8 flex flex-col items-center text-center border border-dashed border-slate-200 dark:border-slate-700 mt-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center mb-3">
              <Waves size={32} strokeWidth={2} />
            </div>
            <h3 className="text-base font-black text-[#0F172A] dark:text-white">
              Nemate spremljenih bazena
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed font-medium">
              Dodajte svoj prvi bazen kako biste izračunavali potrebnu hemiju i pratili parametre vode.
            </p>
            <button
              id="btn-empty-add-pool"
              type="button"
              onClick={handleOpenAdd}
              className="mt-6 py-3 px-6 rounded-2xl bg-[#0062E3] hover:bg-[#0052C4] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Dodaj moj bazen</span>
            </button>
          </div>
        ) : (
          /* 3. & 4. LISTA BAZENA: Kartice sa jasnim aktivnim statusom */
          <div className="flex flex-col space-y-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
              Kliknite na bazen koji želite postaviti kao aktivan:
            </p>

            {pools.map((pool) => {
              const isActive = pool.id === activePoolId;
              const dimensionText =
                pool.shape === 'round'
                  ? `Ø ${pool.diameter} cm • Visina ${pool.height} cm`
                  : `${pool.length} × ${pool.width} × ${pool.height} cm`;

              const shapeLabel =
                pool.shape === 'round'
                  ? 'Okrugli'
                  : pool.shape === 'rectangular'
                  ? 'Pravougaoni'
                  : 'Ovalni';

              return (
                <div
                  key={pool.id}
                  id={`pool-card-${pool.id}`}
                  onClick={() => handleSetActive(pool.id)}
                  className={`w-full rounded-2xl p-4 transition-all duration-150 relative cursor-pointer border ${
                    isActive
                      ? 'border-[#0062E3] dark:border-blue-500 ring-2 ring-blue-500/15 shadow-sm bg-blue-50/20 dark:bg-blue-950/40'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-750 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Radio/Selector + Thumbnail + Details */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Active Radio Check */}
                      <div className="mt-1 text-[#0062E3] dark:text-blue-400 flex-shrink-0">
                        {isActive ? (
                          <CheckCircle2 size={22} className="fill-[#0062E3] text-white" />
                        ) : (
                          <Circle size={22} className="text-slate-300 dark:text-slate-600 hover:text-slate-400" />
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        <PoolThumbnailIcon shape={pool.shape} size={46} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-white truncate">
                            {pool.name}
                          </h3>
                          {isActive && (
                            <span className="px-2 py-0.5 bg-[#0062E3] text-white text-[10px] font-extrabold rounded-full shadow-2xs">
                              Aktivan
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                          {shapeLabel} • {dimensionText}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-[#0062E3] dark:text-blue-400">
                            {formatLiters(pool.workingVolumeLiters)} L
                          </span>
                          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
                            (radna {pool.fillPercentage}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Icons (Edit, Delete) - stopPropagation to prevent re-activating */}
                    <div
                      className="flex items-center gap-1.5 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        id={`btn-edit-pool-${pool.id}`}
                        type="button"
                        onClick={() => handleOpenEdit(pool)}
                        className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 hover:text-[#0062E3] dark:hover:text-blue-400 flex items-center justify-center transition-colors border border-slate-200/80 dark:border-slate-600 cursor-pointer focus:outline-none"
                        aria-label="Uredi bazen"
                        title="Uredi"
                      >
                        <Pencil size={15} strokeWidth={2.2} />
                      </button>

                      <button
                        id={`btn-delete-pool-${pool.id}`}
                        type="button"
                        onClick={() => handleDeleteRequest(pool)}
                        className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-colors border border-slate-200/80 dark:border-slate-600 cursor-pointer focus:outline-none"
                        aria-label="Izbriši bazen"
                        title="Izbriši"
                      >
                        <Trash2 size={15} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. DONJE DUGME "+ Dodaj novi bazen" JE POTPUNO UKLONJENO KAKO BI PROSTOR OSTAO ČIST I PREGLEDAN */}
      </div>

      {/* Delete Confirmation Modal */}
      <DeletePoolModal
        isOpen={Boolean(poolToDelete)}
        poolName={poolToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPoolToDelete(null)}
      />
    </div>
  );
};
