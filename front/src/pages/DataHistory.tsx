import { useState, useEffect, useCallback } from 'react';
import { FileText, Download, Calendar, AlertCircle, Search, Loader2, RefreshCw, Trash2, PlayCircle } from 'lucide-react';
import { fileService } from '../services/fileService';
import ConfirmDeleteModal from '../components/common/ConfirmDelete';
import type { UploadedFile } from '../types/files';

export default function DataHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ id: number, name: string } | null>(null);

  const fetchFiles = useCallback(async (showFullLoader = true) => {
    try {
      if (showFullLoader) setIsLoading(true);
      else setIsRefreshing(true);
      const data = await fileService.getAllFiles();
      setFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleProcess = async (fileId: number) => {
    try {
      setProcessingId(fileId);
      await fileService.processFile(fileId);
      await fetchFiles(false);
    } catch (error) {
      console.error(error);
      alert("Error al procesar el archivo");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      setDownloadingId(fileId);
      const downloadUrl = await fileService.getDownloadUrl(fileId);
      if (downloadUrl) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName);
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!showConfirm) return;
    const idToDelete = showConfirm.id;

    try {
      setDeletingId(idToDelete);
      await fileService.deleteFile(idToDelete);
      setFiles(prev => prev.filter(f => f.id !== idToDelete));
    } catch (error) {
      console.error(error);
      fetchFiles(false);
    } finally {
      setDeletingId(null);
      setShowConfirm(null);
    }
  };

  const filteredFiles = files.filter(file => 
    (file?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      <ConfirmDeleteModal 
        isOpen={showConfirm !== null}
        onClose={() => setShowConfirm(null)}
        onConfirm={handleDelete}
        fileName={showConfirm?.name || ''}
        isDeleting={deletingId !== null}
      />

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none ">
            HISTORIAL DE DATOS
          </h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
            REGISTRO DE EXCEL 
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => fetchFiles(false)}
            disabled={isLoading || isRefreshing}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-yellow-400 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 group"
          >
            <RefreshCw size={20} className={`${isRefreshing ? 'animate-spin text-yellow-400' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>

          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="BUSCAR ARCHIVO..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-bold text-white outline-none focus:border-yellow-400/30 transition-all tracking-[0.2em] uppercase"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="glass-card p-6 border-white/5 bg-white/[0.01] rounded-[2rem] flex items-center gap-5 border min-w-[300px] shadow-2xl">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-yellow-400">
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Archivos en Sistema</p>
            <p className="text-[12px] font-black text-white uppercase tracking-widest mt-1">
              {isLoading ? '--' : `${files.length} REGISTROS`}
            </p>
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
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-left">Estado / Carga</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-20 text-center">
                    <Loader2 className="animate-spin text-yellow-400 mx-auto" size={40} />
                  </td>
                </tr>
              ) : filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
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
                            Formato: {file.format}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white text-[11px] font-bold tracking-wider">
                          <Calendar size={12} className="text-gray-500" />
                          {file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString('es-GT') : 'N/A'}
                        </div>
                        <div className={`text-[8px] font-black px-2 py-0.5 rounded-full w-fit uppercase ${file.processed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {file.processed ? 'Procesado' : 'Pendiente'}
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center justify-end gap-3">
                        {/* BOTÓN DE PROCESAR: Solo si no está procesado */}
                        {!file.processed && (
                          <button 
                            onClick={() => handleProcess(file.id)}
                            disabled={processingId === file.id || deletingId !== null}
                            className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all active:scale-90 disabled:opacity-50 flex items-center gap-2 group/btn"
                          >
                            {processingId === file.id ? <Loader2 size={20} className="animate-spin" /> : <PlayCircle size={20} />}
                            <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover/btn:block">Procesar</span>
                          </button>
                        )}

                        <button 
                          onClick={() => handleDownload(file.id, file.name)}
                          disabled={downloadingId === file.id || deletingId !== null || processingId === file.id}
                          className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-black hover:bg-yellow-400 transition-all active:scale-90 disabled:opacity-50"
                        >
                          {downloadingId === file.id ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                        </button>

                        <button 
                          onClick={() => setShowConfirm({ id: file.id, name: file.name })}
                          disabled={deletingId !== null || downloadingId !== null || processingId === file.id}
                          className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-white hover:bg-red-500/80 transition-all active:scale-90 disabled:opacity-50"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <AlertCircle className="text-gray-700" size={48} />
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Sin archivos registrados</p>
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