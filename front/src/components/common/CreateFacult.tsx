import { useState } from "react";
import { LayoutGrid, X, AlertCircle,} from "lucide-react";

interface CreateFacultadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (nombre: string) => void;
  existingFacultades: string[];
}

export default function CreateFacultadModal({ isOpen, onClose, onCreate, existingFacultades }: CreateFacultadModalProps) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const nombreLimpio = nombre.trim().toUpperCase();
    
    if (!nombreLimpio) {
      setError("El nombre no puede estar vacío");
      return;
    }

    if (existingFacultades.map(f => f.toUpperCase()).includes(nombreLimpio)) {
      setError("Esta facultad ya existe en el sistema");
      return;
    }

    onCreate(nombreLimpio);
    setNombre("");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#07090e]/80 backdrop-blur-md animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0b0d15] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in overflow-hidden">
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-all">
          <X size={20} />
        </button>

        <div className="relative z-10 flex items-center gap-5 mb-10">
          <div className="p-4 bg-yellow-400 rounded-2xl shadow-xl shadow-yellow-400/20">
            <LayoutGrid size={22} className="text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Nueva Facultad</h2>
            <p className="text-[9px] text-yellow-400/50 font-black uppercase tracking-[0.3em] mt-2">Configuración Inicial</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre de la Unidad</label>
            <input 
              type="text" 
              autoFocus
              value={nombre} 
              onChange={(e) => { setNombre(e.target.value); setError(null); }} 
              placeholder="EJ: FACULTAD DE MEDICINA" 
              className={`w-full bg-white/[0.03] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-6 py-5 text-white text-[11px] font-bold uppercase outline-none focus:border-yellow-400/40 transition-all`}
            />
            {error && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-1">{error}</p>}
          </div>

          <div className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem]">
            <AlertCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
              Al crearla, el sistema se reiniciará para que un administrador cargue el pensum correspondiente.
            </p>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-yellow-400/10"
          >
            Registrar y Salir
          </button>
        </div>
      </div>
    </div>
  );
}