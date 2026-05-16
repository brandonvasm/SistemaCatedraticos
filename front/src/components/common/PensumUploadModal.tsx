import { useState } from "react";
import { createPortal } from "react-dom";
import { Upload, AlertTriangle, CheckCircle2 } from "lucide-react";
import { academicsService } from "../../services/academicsService";

interface Props {
  isOpen: boolean;
  facultyName: string;
  facultyId: number;
  onSuccess: () => void;
}

export default function PensumUploadModal({ isOpen, facultyName, facultyId, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("pensum", file);
      await academicsService.uploadPensum(facultyId, formData);
      onSuccess();
    } catch {
      alert("Error al subir archivo");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-6 bg-[#0b101f]/95 backdrop-blur-xl">
      <div className="w-full max-w-xl bg-[#0f111a] border border-yellow-400/20 rounded-[3.5rem] p-12 text-center shadow-2xl">
        <div className="w-20 h-20 bg-yellow-400/10 rounded-3xl flex items-center justify-center text-yellow-400 mx-auto mb-6"><AlertTriangle size={40} /></div>
        <h2 className="text-3xl font-black text-white uppercase mb-2">Acceso Restringido</h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-10">Carga el pensum de {facultyName} para habilitar el sistema</p>
        
        <div className={`border-2 border-dashed rounded-[2rem] p-10 transition-all ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10'}`}>
          <input type="file" id="file-p" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
          <label htmlFor="file-p" className="cursor-pointer flex flex-col items-center">
            {file ? <CheckCircle2 className="text-emerald-400 mb-2" /> : <Upload className="text-gray-600 mb-2" />}
            <span className="text-white text-[10px] font-black uppercase">{file ? file.name : "Seleccionar Malla Curricular"}</span>
          </label>
        </div>

        <button onClick={handleUpload} disabled={!file || loading} className="w-full mt-10 bg-yellow-400 disabled:bg-gray-800 text-black font-black py-5 rounded-2xl">
          {loading ? "CARGANDO..." : "HABILITAR FACULTAD"}
        </button>
      </div>
    </div>,
    document.body
  );
}