import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeletePoolModalProps {
  isOpen: boolean;
  poolName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeletePoolModal: React.FC<DeletePoolModalProps> = ({
  isOpen,
  poolName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-delete-pool-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        id="modal-delete-pool-dialog"
        className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="dialog-delete-title"
        aria-describedby="dialog-delete-desc"
      >
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-100">
          <Trash2 size={28} strokeWidth={2.2} />
        </div>

        {/* Title */}
        <h3
          id="dialog-delete-title"
          className="text-lg font-black text-[#0F172A] tracking-tight"
        >
          Izbrisati bazen?
        </h3>

        {/* Description */}
        <p
          id="dialog-delete-desc"
          className="text-xs font-normal text-slate-500 mt-2 leading-relaxed max-w-xs"
        >
          Ovaj bazen <span className="font-bold text-slate-700">"{poolName}"</span> i njegovi podaci bit će uklonjeni sa uređaja.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <button
            id="btn-cancel-delete"
            type="button"
            onClick={onCancel}
            className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer focus:outline-none"
          >
            Otkaži
          </button>

          <button
            id="btn-confirm-delete"
            type="button"
            onClick={onConfirm}
            className="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-md shadow-red-600/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Izbriši
          </button>
        </div>
      </div>
    </div>
  );
};
