import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import NotificationItem from "./NotificationItem"; 
import Filters from "./Filters"; 
import { Loader2, BellOff } from "lucide-react";
import type { NotificationPayload } from "../../types/notification";

export default function NotificationsList({ notifications, onDelete, loading }: any) {
  const { user } = useAuth(); 
  const [activeFilter, setActiveFilter] = useState("all");

  const getNotificationType = (n: NotificationPayload): "warning" | "success" | "performance" => {
    const focus = n.focus?.toLowerCase() || "";
    const subject = n.subject?.toLowerCase() || "";
    
    if (focus.includes('rendimiento') || subject.includes('excelencia')) return "performance";
    if (n.type === "warning" || n.type === "error" || focus.includes('critica')) return "warning";
    return "success";
  };

  const userNotifications = useMemo(() => {
    if (!user?.id) return [];
    return notifications.filter((n: NotificationPayload) => {
      const notificationUserId = (n.user as any)?.id || n.user;
      return Number(notificationUserId) === Number(user.id);
    });
  }, [notifications, user?.id]);

  const filteredNotifications = useMemo(() => {
    return userNotifications.filter((n: NotificationPayload) => {
      const type = getNotificationType(n);
      if (activeFilter === "all") return true;
      if (activeFilter === "critical") return type === "warning";
      if (activeFilter === "performance") return type === "performance";
      if (activeFilter === "success") return type === "success";
      return true;
    });
  }, [userNotifications, activeFilter]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Filters 
        notifications={notifications} 
        onFilterChange={setActiveFilter} 
      />

      <div className="group relative bg-white/[0.02] border border-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-yellow-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="mb-4 sm:mb-6 flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest">
              NOTIFICACIONES
            </h2>
            <p className="text-[8px] sm:text-[9px] text-gray-500 font-bold uppercase mt-1">
              {filteredNotifications.length} resultados encontrados
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 relative z-10">
          {loading ? (
            <div className="py-16 sm:py-20 flex flex-col items-center justify-center w-full gap-3">
              <Loader2 className="animate-spin text-yellow-400/50" size={24} />
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((n: NotificationPayload) => (
              <NotificationItem
                key={n.id}
                id={n.id || 0}
                title={n.subject}
                description={n.message}
                type={getNotificationType(n)}
                onDelete={onDelete} 
              />
            ))
          ) : (
            <div className="py-16 sm:py-20 flex flex-col items-center gap-3 sm:gap-4 opacity-20 text-center">
              <BellOff size={28} className="text-gray-500" />
              <p className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] sm:tracking-[0.4em] px-4">
                Sin alertas en esta categoría
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}