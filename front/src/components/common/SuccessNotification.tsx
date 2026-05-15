import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';

export default function SuccessNotification() {
  const [show, setShow] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const hasSuccess = localStorage.getItem('semester_success');
    
    if (hasSuccess) {
      setShow(true);
      localStorage.removeItem('semester_success');

      const triggerSync = async () => {
        if (user?.id) {
          try {
            await notificationService.createNotification({
              subject: "Apertura de Semestre",
              message: "Se ha completado el cierre y la apertura del nuevo semestre académico con éxito",
              focus: "Nuevo Semestre",
              type: "success",
              user: user.id
            });
          } catch (error) {
            console.error(error);
          }
        }
      };

      triggerSync();
      
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none p-4">
      <div className="bg-[#1e2230] border border-emerald-500/30 rounded-[2.5rem] p-10 shadow-[0_30px_70px_rgba(0,0,0,0.6)] flex flex-col items-center gap-5 animate-in fade-in zoom-in duration-500 pointer-events-auto max-w-sm w-full">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-500">
          <CheckCircle2 size={40} strokeWidth={1.5} />
        </div>
        
        <div className="text-center">
          <h4 className="text-white font-black uppercase tracking-tighter text-xl">¡Semestre Activo!</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2 leading-relaxed">
            Se ha completado el cierre y la apertura del nuevo semestre académico
          </p>
        </div>
        <button 
          onClick={() => setShow(false)} 
          className="px-10 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] text-gray-400 font-black uppercase tracking-widest transition-all"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}