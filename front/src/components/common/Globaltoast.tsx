import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, X } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

export default function GlobalToast() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('Procesamiento activo');
  const [description, setDescription] = useState('La carga de archivos estará en segundo plano unos minutos');
  const { user } = useAuth();

  useEffect(() => {
    const handleStart = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      setMessage(detail.message || 'Procesamiento activo');
      setDescription(detail.description || 'La carga de archivos estará en segundo plano unos minutos');
      setStatus('processing');
    };
    
    const handleFinish = async () => {
      setMessage('¡Carga Completada!');
      setDescription('Los datos se han actualizado correctamente');
      setStatus('success');

      if (user?.id) {
        try {
          await notificationService.createNotification({
            subject: "Procesamiento de Datos",
            message: "La carga de archivos se ha completado correctamente",
            focus: "Carga de Datos",
            type: "success",
            user: user.id
          });
        } catch (error) {
          console.error(error);
        }
      }

      setTimeout(() => setStatus('idle'), 6000); 
    };
    const handleError = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      setMessage(detail.title || 'No se pudo completar el procesamiento');
      setDescription(detail.message || 'No se pudo completar la carga de archivos');
      setStatus('error');
    };

    window.addEventListener('show-bg-processing', handleStart);
    window.addEventListener('processing-finished', handleFinish);
    window.addEventListener('processing-failed', handleError);

    return () => {
      window.removeEventListener('show-bg-processing', handleStart);
      window.removeEventListener('processing-finished', handleFinish);
      window.removeEventListener('processing-failed', handleError);
    };
  }, [user]);

  if (status === 'idle') return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10001] animate-in slide-in-from-bottom-10 duration-500">
      {status === 'processing' ? (
        <div className="bg-[#0f111a] border border-yellow-400/20 backdrop-blur-2xl px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex items-center gap-5">
          <div className="relative">
            <Loader2 className="text-yellow-400 animate-spin" size={24} />
            <div className="absolute inset-0 blur-md bg-yellow-400/20 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-[11px] font-black uppercase tracking-[0.2em]">{message}</span>
            <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">{description}</span>
          </div>
        </div>
      ) : status === 'success' ? (
        <div className="bg-[#0f111a] border border-green-500/30 backdrop-blur-2xl px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex items-center gap-5 animate-in zoom-in duration-300">
          <div className="p-2 bg-green-500/20 rounded-full">
            <CheckCircle2 className="text-green-500" size={24} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-white text-[11px] font-black uppercase tracking-[0.2em]">{message}</span>
            <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">{description}</span>
          </div>
          <button onClick={() => setStatus('idle')} className="ml-4 text-gray-700 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="bg-[#0f111a] border border-red-500/30 backdrop-blur-2xl px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex items-center gap-5 animate-in zoom-in duration-300">
          <div className="p-2 bg-red-500/20 rounded-full">
            <X className="text-red-500" size={24} />
          </div>
          <div className="flex flex-col text-left max-w-lg">
            <span className="text-white text-[11px] font-black uppercase tracking-[0.2em]">{message}</span>
            <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">{description}</span>
          </div>
          <button onClick={() => setStatus('idle')} className="ml-4 text-gray-700 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
