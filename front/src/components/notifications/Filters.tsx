import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext"; 
import type { NotificationPayload } from "../../types/notification";

type Props = {
  notifications: NotificationPayload[];
  onFilterChange: (filter: string) => void;
};

export default function Filters({ notifications, onFilterChange }: Props) {
  const { user } = useAuth(); 

  const userNotifications = useMemo(() => {
    if (!user?.id) return [];
    
    return notifications.filter((n) => {
      const notificationUserId = (n.user as any)?.id || n.user;
      return Number(notificationUserId) === Number(user.id);
    });
  }, [notifications, user?.id]);

  const stats = useMemo(() => {
    return userNotifications.reduce((acc, n) => {
      const focus = n.focus?.toLowerCase() || "";
      const subject = n.subject?.toLowerCase() || "";
      
      if (focus.includes('rendimiento') || subject.includes('excelencia')) {
        acc.excellence++;
      } 
      else if (n.type === 'warning' || n.type === 'error' || focus.includes('critica')) {
        acc.critical++;
      } 
      else {
        acc.success++;
      }
      return acc;
    }, { all: userNotifications.length, excellence: 0, critical: 0, success: 0 });
  }, [userNotifications]);

  const filterOptions = [
    { id: "all", label: `Todas (${stats.all})` },
    { id: "critical", label: `Críticas (${stats.critical})` },
    { id: "performance", label: `Excelencia (${stats.excellence})` },
    { id: "success", label: `Resueltas (${stats.success})` },
  ];

  const [active, setActive] = useState("all");

  const handlePress = (id: string) => {
    setActive(id);
    onFilterChange(id); 
  };

  return (
    <div className="group relative bg-white/[0.02] border border-white/5 p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.8rem] backdrop-blur-2xl shadow-2xl mb-6 sm:mb-10 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-yellow-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <p className="mb-4 sm:mb-5 text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] relative z-10">
        Filtros de búsqueda
      </p>

      <div className="flex flex-wrap gap-2 sm:gap-3 relative z-10">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => handlePress(f.id)}
            className={`
              px-4 py-2.5 sm:px-6 sm:py-3
              rounded-xl sm:rounded-2xl
              text-[9px] sm:text-[10px]
              font-black
              uppercase
              tracking-widest
              transition-all duration-300
              active:scale-95
              flex-1 sm:flex-initial
              text-center
              min-w-[120px] sm:min-w-0
              ${
                active === f.id
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 hover:bg-yellow-300"
                  : "bg-white/[0.03] border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}