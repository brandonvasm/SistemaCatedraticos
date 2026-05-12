import { useState } from 'react';
import { createPortal } from "react-dom";
import { X, FileSpreadsheet, Upload, ChevronRight, ShieldAlert, CheckCircle2, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { fileService } from '../../services/fileService';
import { useAuth } from '../../context/AuthContext'; 
import type { FileRequirement } from '../../types/files';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILE_REQUIREMENTS: FileRequirement[] = [
  { id: 'pensum', name: 'Pensum' },
  { id: 'roster', name: 'Nómina' },
  { id: 'evaluation', name: 'Evaluación docente' },
  { id: 'comments', name: 'Comentarios' },
  { id: 'control', name: 'Control docente' },
  { id: 'ceat', name: 'CEAT' },
];

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { user } = useAuth(); 
  const [showTutorial, setShowTutorial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});
  const [uploadedFileNames, setUploadedFileNames] = useState<Record<string, string>>({});
  const [fileIds, setFileIds] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  const handleUpload = async (id: string, file: File) => {
    if (uploadingStatus[id] || !user) return;
    setUploadingStatus(prev => ({ ...prev, [id]: true }));
    setError(null);

    try {
      const semesterId = user.semester_id;
      const userId = user.id;
      const facultyId = user.faculty_id || user.faculty_id|| 0;

      const response = await fileService.uploadFile(
        file, 
        id, 
        semesterId, 
        userId, 
        facultyId
      );

      setFileIds(prev => ({ ...prev, [id]: response.id }));
      setUploadedFiles(prev => ({ ...prev, [id]: true }));
      setUploadedFileNames(prev => ({ ...prev, [id]: file.name }));
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Error en carga';
      setError(`${id.toUpperCase()}: ${msg.toUpperCase()}`);
    } finally {
      setUploadingStatus(prev => ({ ...prev, [id]: false }));
    }
  };


  const handleFinalProcess = async () => {
    const filesToProcess = FILE_REQUIREMENTS
      .map(file => ({ ...file, fileId: fileIds[file.id] }))
      .filter(file => Boolean(file.fileId));

    if (filesToProcess.length === 0) return;

    window.dispatchEvent(new CustomEvent('show-bg-processing', {
      detail: {
        message: `Preparando ${filesToProcess.length} archivos`,
        description: 'El sistema está iniciando el procesamiento de los datos',
      }
    }));
    onClose();

    try {
      for (let index = 0; index < filesToProcess.length; index += 1) {
        const file = filesToProcess[index];
        const response = await fileService.processFile(file.fileId);

        if (!response.task_id) {
          window.dispatchEvent(new CustomEvent('show-bg-processing', {
            detail: {
              message: `Procesando ${index + 1}/${filesToProcess.length}: ${file.name}`,
              description: response.detail || 'El archivo ya fue procesado',
            }
          }));
          continue;
        }

        await fileService.waitForProcess(file.fileId, response.task_id, {
          onStatus: (status) => {
            window.dispatchEvent(new CustomEvent('show-bg-processing', {
              detail: {
                message: `Procesando ${index + 1}/${filesToProcess.length}: ${file.name}`,
                description: getStatusDescription(status.meta?.step || status.state),
              }
            }));
          }
        });
      }
      window.dispatchEvent(new CustomEvent('processing-finished'));
    } catch (err: any) {
      console.error("Error en procesamiento:", err);
      window.dispatchEvent(new CustomEvent('processing-failed', {
        detail: {
          title: 'No se pudo procesar el archivo',
          message: err.message || 'No se pudo completar el procesamiento de archivos',
        }
      }));
    }
  };

  const getStatusDescription = (step: string) => {
    const descriptions: Record<string, string> = {
      downloading_file: 'Descargando archivo desde almacenamiento',
      processing_excel: 'Leyendo y validando el Excel',
      inserting_records: 'Guardando registros en el sistema',
      PENDING: 'Esperando turno de procesamiento',
      STARTED: 'Procesamiento iniciado',
      PROGRESS: 'Procesamiento en progreso',
    };

    return descriptions[step] || 'Procesamiento en segundo plano';
  };

  const modalContent = (

    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-white/[0.01] backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0f111a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
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
              <p className="text-[9px] text-gray-500 font-bold tracking-[0.3em] uppercase opacity-60">Sincronización Total</p>
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
                <AlertTriangle className="text-yellow-400 shrink-0" size={16} />
                <p className="text-[11px] font-black text-gray-400 leading-relaxed uppercase tracking-[0.2em]">
                  Al finalizar, el sistema leerá los archivos y actualizará los datos del semestre.
                </p>
              </div>
              <button onClick={() => setShowTutorial(false)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-2 transition-all text-[11px] uppercase tracking-[0.2em]">
                EMPEZAR CARGA <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              {FILE_REQUIREMENTS.map((file, i) => (
                <div key={file.id} className={`p-5 rounded-[2rem] border transition-all duration-500 ${uploadedFiles[file.id] ? 'bg-yellow-400/[0.02] border-yellow-400/20' : 'bg-white/[0.02] border-white/5 group hover:border-white/20'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-[14px] font-black text-yellow-400/30 tracking-tighter uppercase">0{i + 1}</span>
                      <div>
                        <h4 className={`text-[12px] font-black tracking-widest uppercase ${uploadedFiles[file.id] ? 'text-yellow-400' : 'text-white'}`}>
                          {file.name}
                        </h4>
                        {uploadedFileNames[file.id] && (
                          <p className="mt-1 text-[9px] font-bold text-gray-500 truncate max-w-[200px]">
                            {uploadedFileNames[file.id]}
                          </p>
                        )}
                      </div>
                    </div>
                    {uploadingStatus[file.id] ? <Loader2 size={18} className="text-yellow-400 animate-spin" /> : uploadedFiles[file.id] ? <CheckCircle2 size={18} className="text-yellow-400 animate-in zoom-in" /> : <Upload className="text-gray-700" size={18} />}
                  </div>
                  
                  {!uploadingStatus[file.id] && (
                    <div className="mt-4">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-[9px] font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all">
                        {uploadedFiles[file.id] ? <><RefreshCw size={12} /> Reemplazar</> : 'Seleccionar'}
                        <input type="file" className="hidden" accept=".xlsx,.xls" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(file.id, f); }} />
                      </label>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-4 pt-6">
                <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-[9px] uppercase tracking-[0.3em] hover:bg-white/10 border border-white/5">
                  Cancelar
                </button>
                <button onClick={handleFinalProcess} disabled={Object.keys(uploadedFiles).length === 0} className="flex-[2] bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-2xl text-[9px] uppercase tracking-[0.3em] transition-all shadow-lg shadow-yellow-400/10">
                  FINALIZAR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
