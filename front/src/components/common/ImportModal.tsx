import { useState } from 'react';
import { createPortal } from "react-dom";
import { X, FileSpreadsheet, Upload, ChevronRight, ShieldAlert, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { fileService } from '../../services/fileService';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILE_REQUIREMENTS = [
  { id: 'ceat', name: 'ceat.xlsx' },
  { id: 'comentarios', name: 'comentarios.xlsx' },
  { id: 'control', name: 'control docente.xlsx' },
  { id: 'evaluacion', name: 'evaluación docente.xlsx' },
  { id: 'nomina', name: 'nómina de ejemplo.xlsx' },
  { id: 'pensum', name: 'pensum 24001.xls' },
];

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [showTutorial, setShowTutorial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleUpload = async (id: string, file: File) => {
    setUploadingStatus(prev => ({ ...prev, [id]: true }));
    setError(null);

    try {
      await fileService.uploadFile(file, id);
      setUploadedFiles(prev => ({ ...prev, [id]: true }));
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Error en la carga';
      setError(msg.toUpperCase());
    } finally {
      setUploadingStatus(prev => ({ ...prev, [id]: false }));
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-white/[0.01] backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0f111a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-200">
        
        {error && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[10000] w-[85%] animate-in slide-in-from-top-full">
            <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 shadow-2xl">
              <ShieldAlert className="text-red-500 shrink-0" size={18} />
              <p className="text-[10px] font-black text-red-200 leading-tight uppercase tracking-widest">{error}</p>
            </div>
          </div>
        )}

        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-400/20 text-black">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tighter uppercase">IMPORTAR DATOS</h2>
              <p className="text-[9px] text-gray-500 font-bold tracking-[0.3em] uppercase opacity-60">Carga Directa a Supabase</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-yellow-400 hover:text-black rounded-full text-gray-500 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar bg-black/20 max-h-[450px]">
          {showTutorial ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-start gap-4">
                <div className="p-2 bg-yellow-400/20 rounded-lg">
                  <AlertTriangle className="text-yellow-400" size={16} />
                </div>
                <p className="text-[11px] font-black text-gray-400 leading-relaxed uppercase tracking-[0.2em]">
                  Los archivos se cargarán automáticamente. El estado cambiará a <span className="text-yellow-400 italic">"pendiente"</span> antes la carga exitosa.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {FILE_REQUIREMENTS.map((req) => (
                  <div key={req.id} className="px-5 py-4 rounded-2xl bg-white/[0.01] border border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{req.name}</span>
                    {uploadedFiles[req.id] && <CheckCircle2 size={14} className="text-yellow-400" />}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowTutorial(false)} 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-2 transition-all text-[11px] uppercase tracking-[0.2em]"
              >
                CONTINUAR A CARGA <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              {FILE_REQUIREMENTS.map((file, i) => (
                <div 
                  key={file.id} 
                  className={`p-5 rounded-[2rem] border transition-all duration-500 ${
                    uploadedFiles[file.id] 
                    ? 'bg-yellow-400/[0.02] border-yellow-400/20' 
                    : 'bg-white/[0.02] border-white/5 group hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-[14px] font-black text-yellow-400/30 tracking-tighter italic uppercase">0{i + 1}</span>
                      <div>
                        <h4 className={`text-[12px] font-black tracking-widest uppercase ${uploadedFiles[file.id] ? 'text-yellow-400' : 'text-white'}`}>
                          {file.name}
                        </h4>
                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                          {uploadingStatus[file.id] ? 'Subiendo...' : uploadedFiles[file.id] ? 'Almacenado · Pendiente' : 'Esperando archivo'}
                        </p>
                      </div>
                    </div>
                    {uploadingStatus[file.id] ? (
                      <Loader2 size={18} className="text-yellow-400 animate-spin" />
                    ) : uploadedFiles[file.id] ? (
                      <CheckCircle2 size={18} className="text-yellow-400 animate-in zoom-in" />
                    ) : (
                      <Upload className="text-gray-700 group-hover:text-yellow-400 transition-all cursor-pointer" size={18} />
                    )}
                  </div>
                  {!uploadedFiles[file.id] && !uploadingStatus[file.id] && (
                    <div className="mt-4">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-[9px] font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all">
                        Seleccionar Archivo
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".xlsx, .xls" 
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUpload(file.id, f);
                          }} 
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setShowTutorial(true)} 
                  className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-[9px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all border border-white/5"
                >
                  Tutorial
                </button>
                <button 
                  onClick={onClose}
                  className="flex-[2] bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-2xl text-[9px] uppercase tracking-[0.3em] transition-all shadow-lg shadow-yellow-400/10"
                >
                  Finalizar Carga
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-center">
          <p className="text-[8px] text-gray-600 font-black leading-tight uppercase tracking-[0.4em]">
            Servidor de Almacenamiento Institucional
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}