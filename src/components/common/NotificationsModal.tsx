import React from 'react';
import { X, Bell, CheckCheck, Droplets } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Modal dialog */}
      <div
        id="modal-notifications"
        className="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl z-10 border border-slate-100 dark:border-slate-700 transition-colors"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#0062E3] dark:text-blue-400 flex items-center justify-center">
              <Bell size={18} />
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">Obavijesti</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2.5">
          <div className="p-3 bg-[#F0F7FF] dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0062E3] text-white flex-shrink-0 flex items-center justify-center mt-0.5 shadow-xs">
              <Droplets size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dobrodošli u Bazen aplikaciju!</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                Započnite dodavanjem vašeg bazena za automatski proračun hemije i optimalno održavanje vode.
              </p>
              <span className="text-[9px] text-blue-600 dark:text-blue-400 font-semibold mt-1 inline-block">Upravo sada</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Zatvori
        </button>
      </div>
    </div>
  );
};
