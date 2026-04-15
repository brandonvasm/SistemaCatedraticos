import React, { useState } from 'react';
import { createPortal } from "react-dom"; 
import {  FileSpreadsheet, Upload, CheckCircle2, Loader2, Sparkles, LogOut } from 'lucide-react';
import api from '../../api/axios';

interface ImportPensumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  facultadName: string;
}

export default function ImportPensumModal({ isOpen, onClose, onSuccess, facultadName }: ImportPensumModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const ext = selected.name.split('.').pop()?.toLowerCase();
      if (ext === 'xls' || ext === 'xlsx') {
        setFile(selected);
        setError(null);
      } else {
        setError("Formato inválido (.xls, .xlsx)");
      }
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('pensum', file);
    formData.append('facultad_nombre', facultadName);

    try {
      await api.post('/academic/import-pensum/', formData);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError("Error en la carga del archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#07090e]/90 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0b0d15] border border-white/10 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in overflow-hidden">
        
        <div className="mb-10 flex items-center gap-4">
          <div className="p-4 bg-yellow-400 rounded-2xl shadow-xl shadow-yellow-400/20">
            <FileSpreadsheet size={22} className="text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Activar {facultadName}</h2>
            <p className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest mt-2">Carga de Pensum Requerida</p>
          </div>
        </div>

        {success ? (
          <div className="py-10 text-center animate-in zoom-in">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-6" />
            <p className="text-white font-black uppercase text-xs tracking-widest">Facultad Activada</p>
          </div>
        ) : (
          <div className="space-y-6">
            <label className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[2.5rem] transition-all cursor-pointer ${file ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/10 bg-white/[0.02]'}`}>
              <input type="file" className="hidden" accept=".xls,.xlsx" onChange={handleFileChange} />
              <Upload size={32} className={`mb-4 ${file ? 'text-yellow-400' : 'text-gray-600'}`} />
              <p className="text-[10px] font-black text-white uppercase tracking-widest text-center">
                {file ? file.name : 'Subir PENSUM 24001.XLS'}
              </p>
            </label>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={handleProcess}
                disabled={!file || isUploading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-20 text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
              >
                {isUploading ? <Loader2 className="animate-spin" size={16} /> : <><Sparkles size={16} /> Activar Ahora</>}
              </button>

              <button 
                onClick={onClose}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-400 font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
              >
                <LogOut size={16} /> Dejar Pendiente
              </button>
            </div>
            
            {error && <p className="text-red-500 text-center text-[9px] font-black uppercase tracking-widest">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}