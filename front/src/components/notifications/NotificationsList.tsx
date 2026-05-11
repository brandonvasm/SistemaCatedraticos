import { useEffect, useState, useMemo } from "react";
import NotificationItem from "./NotificationItem";
import Filters from "./Filters"; 
import { notificationService } from "../../services/notificationService";
import type { NotificationPayload } from "../../types/notification";
import { Loader2, BellOff } from "lucide-react";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data: NotificationPayload[] = await notificationService.getNotifications();
      
      const sortedData = data.sort((a: NotificationPayload, b: NotificationPayload) => {
        const idA = a.id || 0;
        const idB = b.id || 0;
        return idB - idA;
      });

      setNotifications(sortedData);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("No se pudo eliminar:", error);
    }
  };

  const getNotificationType = (n: NotificationPayload): "warning" | "success" | "performance" => {
    if (n.focus?.toLowerCase().includes('rendimiento')) return "performance";
    if (n.type === "warning" || n.type === "error") return "warning";
    return "success";
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const type = getNotificationType(n);
      if (activeFilter === "all") return true;
      if (activeFilter === "critical") return type === "warning";
      if (activeFilter === "performance") return type === "performance";
      if (activeFilter === "success") return type === "success";
      return true;
    });
  }, [notifications, activeFilter]);

  return (
    <div className="space-y-6">
      <Filters 
        notifications={notifications} 
        onFilterChange={setActiveFilter} 
      />

      <div className="group relative bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-yellow-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="mb-6 flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest">
              NOTIFICACIONES
            </h2>
            <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">
              {filteredNotifications.length} resultados encontrados
            </p>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center w-full gap-3">
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
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="py-20 flex flex-col items-center gap-4 opacity-20">
              <BellOff size={32} className="text-gray-500" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                Sin alertas en esta categoría
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}