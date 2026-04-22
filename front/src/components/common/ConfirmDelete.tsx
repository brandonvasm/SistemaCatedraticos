import { createPortal } from "react-dom";
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  isDeleting: boolean;
}

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  fileName, 
  isDeleting 
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-white/[0.01] backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-sm bg-[#0f111a] border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500 mb-6">
            <AlertTriangle size={32} />
          </div>
          
          <h3 className="text-xl font-black text-white uppercase tracking-tighter ">¿Eliminar Registro?</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3 leading-relaxed">
            Estás por borrar permanentemente <br/>
            <span className="text-white ">"{fileName}"</span>
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mt-8">
            <button 
              onClick={onClose}
              className="py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all outline-none"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              disabled={isDeleting}
              className="py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 flex items-center justify-center disabled:opacity-50"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}