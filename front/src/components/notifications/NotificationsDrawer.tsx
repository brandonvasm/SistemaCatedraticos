import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle, CheckCircle, BellOff, Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notificationService";
import type { NotificationPayload } from "../../types/notification";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NotificationsDrawer({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data: NotificationPayload[] = await notificationService.getNotifications();
      const sortedData = data.sort((a: NotificationPayload, b: NotificationPayload) => {
        const idA = a.id || 0;
        const idB = b.id || 0;
        return idB - idA;
      });
      setNotifications(sortedData.slice(0, 4)); 
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev: NotificationPayload[]) => 
        prev.filter((n: NotificationPayload) => n.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const drawerContent = (
    <div
      className={`
        fixed top-0 right-0 h-full w-full sm:w-[420px]
        bg-[#0b101f]
        border-l border-white/10 z-[9999]
        transform transition-transform duration-500 ease-out 
        shadow-[-15px_0_30px_rgba(0,0,0,0.5)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="p-6 flex justify-between items-center border-b border-white/5">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight uppercase">
            Notificaciones
          </h2>
          <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] mt-1">
            {notifications.length} alertas recientes
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-6 space-y-4 overflow-y-auto h-[calc(100vh-210px)] custom-scrollbar">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center w-full gap-4">
            <Loader2 className="animate-spin text-yellow-400/50" size={32} />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n: NotificationPayload) => {
            const isWarning = n.type === "warning" || n.type === "error";
            return (
              <div
                key={n.id}
                className={`
                  p-5 rounded-[1.5rem] border transition-all duration-300 relative group
                  ${isWarning
                    ? "bg-red-500/10 border-red-500/20 hover:bg-red-500/15"
                    : "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15"
                  }
                `}
              >
                <div className="flex gap-4">
                  <div className={`
                      w-11 h-11 flex items-center justify-center rounded-2xl border shrink-0
                      ${isWarning ? "bg-red-500/20 border-red-500/30" : "bg-emerald-500/20 border-emerald-500/30"}
                  `}>
                    {isWarning ? <AlertTriangle size={18} className="text-red-400" /> : <CheckCircle size={18} className="text-emerald-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight">{n.subject}</p>
                    <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">{n.message}</p>
                    <div className="flex gap-2 mt-4 text-[9px] uppercase tracking-widest font-bold">
                      <span className="bg-white/[0.05] border border-white/10 px-2 py-1 rounded-md text-gray-400">{n.focus}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => n.id && handleDelete(n.id, e)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 flex flex-col items-center gap-4 opacity-20">
            <BellOff size={48} className="text-gray-500" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Sin alertas nuevas</p>
          </div>
        )}
      </div>

      <div className="p-6 pb-14 border-t border-white/5 bg-[#0b101f]">
        <button
          onClick={() => {
            onClose();
            navigate("/notificaciones");
          }}
          className="
            w-full bg-white/[0.03] border border-white/10 py-4 rounded-2xl 
            text-[10px] font-bold uppercase tracking-widest text-gray-300 
            hover:bg-white/10 hover:text-white transition-all active:scale-95
          "
        >
          Ver Todas las Notificaciones
        </button>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}