import { useState, useMemo } from "react";
import type { NotificationPayload } from "../../types/notification";

type Props = {
  notifications: NotificationPayload[];
  onFilterChange: (filter: string) => void;
};

export default function Filters({ notifications, onFilterChange }: Props) {
  const stats = useMemo(() => {
    const excellence = notifications.filter(n => n.focus?.toLowerCase().includes('rendimiento')).length;
    const rest = notifications.filter(n => !n.focus?.toLowerCase().includes('rendimiento'));
    
    return {
      all: notifications.length,
      excellence,
      critical: rest.filter(n => n.type === 'warning' || n.type === 'error').length,
      success: rest.filter(n => n.type === 'success').length,
    };
  }, [notifications]);

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
    <div className="group relative bg-white/[0.02] border border-white/5 p-6 rounded-[2.8rem] backdrop-blur-2xl shadow-2xl mb-10 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-yellow-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <p className="mb-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] relative z-10">
        NOTIFICACIONES
      </p>

      <div className="flex flex-wrap gap-3 relative z-10">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => handlePress(f.id)}
            className={`
              px-6 py-3
              rounded-2xl
              text-[10px]
              font-black
              uppercase
              tracking-widest
              transition-all duration-300
              active:scale-95
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