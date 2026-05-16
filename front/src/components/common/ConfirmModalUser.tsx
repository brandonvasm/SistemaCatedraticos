import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
  isActive?: boolean; 
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading, isActive }: Props) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-[#07080a]/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-md bg-[#11141d] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            isActive ? "bg-red-500/10" : "bg-emerald-500/10"
          }`}>
            {isActive ? (
              <AlertTriangle className="text-red-500" size={40} />
            ) : (
              <CheckCircle2 className="text-emerald-500" size={40} />
            )}
          </div>
          
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
            {title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            {message}
          </p>

          <div className="flex w-full gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all uppercase text-xs tracking-widest"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-6 py-4 rounded-2xl font-black transition-all shadow-lg flex items-center justify-center uppercase text-xs tracking-widest text-white ${
                isActive 
                  ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" 
                  : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                isActive ? "Desactivar" : "Reactivar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}