import { useState } from 'react';
import { FileText, Download, Calendar, AlertCircle, Search } from 'lucide-react';
import uploadedFiles from '../data/uploadedfiles';
import type { UploadedFile } from '../types/files';

export default function DataHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = uploadedFiles.filter(file => 
    (file?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            HISTORIAL DE DATOS
          </h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
            REGISTRO DE EXCEL · FACULTAD DE INGENIERÍA
          </p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="BUSCAR ARCHIVO..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-bold text-white outline-none focus:border-yellow-400/30 transition-all tracking-[0.2em]"
          />
        </div>
      </header>

      <div className="flex">
        <div className="glass-card p-6 border-white/5 bg-white/[0.01] rounded-[2rem] flex items-center gap-5 border min-w-[300px]">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-yellow-400">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Archivos Subidos</p>
            <p className="text-xl font-black text-white uppercase tracking-tighter">{uploadedFiles.length}</p>
          </div>
        </div>
      </div>

      <div className="glass-card relative overflow-hidden bg-white/[0.01] border-white/5 rounded-[3rem] shadow-2xl border">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="overflow-x-auto text-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-left">Documento</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-left">Fecha de Carga</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file: UploadedFile) => (
                  <tr key={file.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white group-hover:border-yellow-400/50 transition-colors">
                          <FileText size={24} />
                        </div>
                        <div>
                          <div className="text-[12px] font-black uppercase tracking-widest group-hover:text-yellow-400 transition-colors">
                            {file.name}
                          </div>
                          <div className="text-[9px] text-gray-600 font-bold mt-1 uppercase tracking-tighter">
                        
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white text-[11px] font-bold tracking-wider">
                          <Calendar size={12} className="text-gray-500" />
                          {new Date(file.upload_date).toLocaleDateString('es-GT')}
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <button 
                        className="inline-flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-black hover:bg-yellow-400 transition-all active:scale-90 shadow-lg"
                      >
                        <Download size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <AlertCircle className="text-gray-700" size={48} />
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">No se encontraron registros disponibles</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}