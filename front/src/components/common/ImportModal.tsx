import  { useState } from 'react';
import { createPortal } from "react-dom"; 
import { X, FileSpreadsheet, Upload,  ChevronRight, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILE_REQUIREMENTS = [
  { id: 'ceat', name: 'ceat.xlsx', fields: ['id_auditoria', 'resultado_ceat'] },
  { id: 'comentarios', name: 'comentarios.xlsx', fields: ['id_docente', 'texto_comentario'] },
  { id: 'control', name: 'control docente.xlsx', fields: ['nombre', 'especialidad'] },
  { id: 'evaluacion', name: 'evaluación docente.xlsx', fields: ['id_docente', 'puntaje_pregunta'] },
  { id: 'nomina', name: 'nómina de ejemplo.xlsx', fields: ['id_docente', 'salario'] },
  { id: 'pensum', name: 'pensum 24001.xls', fields: ['código_curso', 'asignatura'] },
];

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [showTutorial, setShowTutorial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcess = () => {
    setError("advertencia: la estructura de las columnas no es válida. revisa el tutorial.");
    setTimeout(() => setError(null), 4000);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      

      <div 
        className="fixed inset-0 bg-white/[0.01] backdrop-blur-md transition-opacity animate-in fade-in duration-500" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-[#0f111a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-200">
        
        {error && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[10000] w-[85%] animate-in slide-in-from-top-full">
            <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 shadow-2xl">
              <ShieldAlert className="text-red-500 shrink-0" size={18} />
              <p className="text-[10px] font-bold text-red-200 leading-tight">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-400/20">
              <FileSpreadsheet size={20} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">importar datos</h2>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest opacity-60">
                gestión de archivos excel
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar bg-black/20 max-h-[450px]">
          {showTutorial ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-5 rounded-[1.5rem] bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
           
                <p className="text-[11px] font-bold text-blue-100/70 leading-relaxed">
                  los archivos deben respetar los encabezados definidos para evitar errores en las métricas finales.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {FILE_REQUIREMENTS.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                    <span className="text-[10px] font-black text-gray-400 block mb-2">{req.name}</span>
                    <div className="flex flex-wrap gap-2">
                      {req.fields.map(f => (
                        <span key={f} className="text-[9px] font-bold bg-white/5 px-2 py-0.5 rounded text-gray-500 border border-white/5">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowTutorial(false)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-2 transition-all active:scale-[0.97] text-[11px]"
              >
                entendido, continuar
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              {FILE_REQUIREMENTS.map((file, i) => (
                <div key={file.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/20 transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-yellow-400/40">0{i + 1}</span>
                      <h4 className="text-xs font-black text-white tracking-tight">{file.name}</h4>
                    </div>
                    <Upload className="text-gray-600 group-hover:text-yellow-400 transition-all cursor-pointer" size={18} />
                  </div>
                  <div className="mt-4">
                    <label className="cursor-pointer inline-block px-5 py-2.5 rounded-xl text-[10px] font-black bg-white/5 border border-white/10 text-gray-400 hover:bg-yellow-400 hover:text-black transition-all">
                      elegir archivo
                      <input type="file" className="hidden" accept=".xlsx, .xls" />
                    </label>
                  </div>
                </div>
              ))}

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setShowTutorial(true)} 
                  className="flex-1 py-4 rounded-xl bg-white/5 border border-white/5 text-gray-500 font-black text-[10px] hover:text-white transition-all"
                >
                  tutorial
                </button>
                <button 
                  onClick={handleProcess}
                  className="flex-[2] bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-xl shadow-xl shadow-yellow-400/10 text-[10px]"
                >
                  procesar datos
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-red-500/5 border-t border-white/5 flex items-center gap-3">
          <AlertTriangle size={14} className="text-red-500 shrink-0" />
          <p className="text-[9px] text-gray-500 font-bold leading-tight">
            atención: la carga incompleta desactiva temporalmente las métricas avanzadas.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}