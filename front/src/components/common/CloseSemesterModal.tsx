import { useState } from 'react';
import { AlertTriangle, ArrowRight, Save, Trash2, X, Info } from 'lucide-react';
import { semesterService } from '../../services/semesterService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSemester: { id: number; year: number; number: number } | null;
}

export default function CloseSemesterModal({ isOpen, onClose, currentSemester }: Props) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'confirm' | 'create'>('confirm');
  const [loading, setLoading] = useState(false);
  const [btnMsg, setBtnMsg] = useState("Abrir Nuevo Semestre");

  const currentYear = new Date().getFullYear();
  const [newSemester, setNewSemester] = useState({ 
    year: currentYear, 
    number: 1 
  });

  if (!isOpen) return null;

  const handleCloseSemester = async () => {
    setLoading(true);
    try {
      setStep('create');
      setBtnMsg("Abrir Nuevo Semestre y cerrar el Anterior")
    } catch (error) {
      console.error("Error al cerrar el semestre:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSemester = async () => {
    const facultyId = user?.faculty_id ? Number(user.faculty_id) : null;
    
    if (!facultyId) {
      console.error("No se encontró ID de facultad");
      return;
    }
    
    setLoading(true);
    try {

      if (currentSemester) {
        await semesterService.closeSemester()
      }

      const createdSemester = await semesterService.createSemester({
        year: newSemester.year,
        number: newSemester.number,
        faculty: facultyId
      });


      localStorage.setItem('semester_success', 'true');

      if (!user) return

      setUser({
        ...user,
        semester_id: createdSemester.id
      })
     
      onClose();
      
      navigate('/dashboard'); 
      window.location.reload(); 

    } catch (error) {
      console.error("Error al crear el nuevo semestre:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0b101f]/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#1e2230] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] -mr-16 -mt-16 transition-colors duration-500 ${step === 'confirm' ? 'bg-red-500/5' : 'bg-emerald-500/5'}`} />

        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {step === 'confirm' && currentSemester ? (
          <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-500 mb-6 shadow-lg shadow-red-500/5">
                <AlertTriangle size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Finalizar Semestre</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3 max-w-[280px]">
                Esta acción es irreversible y moverá todos los registros actuales al historial académico.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                  <Trash2 size={18} />
                </div>
                <div>
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Semestre Activo</p>
                  <p className="text-sm font-bold text-white uppercase">AÑO {currentSemester?.year} - SEMESTRE {currentSemester?.number}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 px-2">
                <Info size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-[9px] text-gray-400 font-medium leading-relaxed">
                  Solo se conservará la informacion como historial. Las tablas se limpiarán para el nuevo ingreso.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-white/5 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Cancelar
              </button>
              <button 
                disabled={loading}
                onClick={handleCloseSemester}
                className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
              >
                {loading ? "Procesando..." : "Siguiente"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-500 mb-6 shadow-lg shadow-emerald-500/5">
                <Save size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Nuevo Semestre</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3">
                Configure el inicio del nuevo semestre académico.
              </p>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-yellow-400 transition-colors">Año Académico</label>
                <input 
                  type="number" 
                  min={currentYear}
                  max={currentYear + 1}
                  value={newSemester.year}
                  onChange={(e) => setNewSemester({...newSemester, year: parseInt(e.target.value)})}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-yellow-400/30 transition-all font-bold"
                />
              </div>

              <div className="group">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-yellow-400 transition-colors">Número de Semestre</label>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewSemester({...newSemester, number: num})}
                      className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                        newSemester.number === num 
                        ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/10' 
                        : 'bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      Semestre {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              onClick={handleCreateSemester}
              className="w-full px-6 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              {loading ? "Iniciando..." : <>{btnMsg}<ArrowRight size={16} /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}