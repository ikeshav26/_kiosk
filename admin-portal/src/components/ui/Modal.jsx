import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, subtitle, icon: Icon, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        <header className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <Icon size={24} />
              </div>
            )}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h2>
              {subtitle && (
                <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all shrink-0"
          >
            <X size={20} />
          </button>
        </header>
        <div className="p-4 sm:p-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
