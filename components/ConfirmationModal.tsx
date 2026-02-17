
import React, { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark-100/80 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-fadeIn" onClick={onCancel}>
      <div
        className="bg-light-100 dark:bg-dark-200 border border-light-300 dark:border-dark-300 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <h2 className="text-2xl font-black dark:text-white text-light-content mb-4">{title}</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            {message}
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-light-content dark:hover:text-white transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-lg ${
                isDanger
                  ? 'bg-red-500 shadow-red-500/20'
                  : 'bg-brand-primary shadow-brand-primary/20'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
