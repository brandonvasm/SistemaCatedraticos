import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Save, School } from "lucide-react";
import { academicsService } from "../../services/academicsService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FacultyModal({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await academicsService.createFaculty(name);
      setName("");
      onSuccess();
      onClose();
    } catch (err) {
      setError("ERROR AL CREAR LA FACULTAD");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-white/1 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-[#0f111a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24}/>
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Nueva Facultad
          </h2>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
            Registro de unidad académica
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold uppercase">
               {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-widest">
              Nombre de la Facultad
            </label>
            <div className="relative">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
              <input 
                required
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white text-xs outline-none focus:border-yellow-400/40 transition-all uppercase tracking-wider"
                placeholder="EJ. INGENIERÍA"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-800 disabled:text-gray-500 text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-lg shadow-yellow-400/10"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20}/> 
                <span className="tracking-widest uppercase">Guardar Facultad</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}