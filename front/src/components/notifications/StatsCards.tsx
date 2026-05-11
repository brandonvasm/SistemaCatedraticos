import { useEffect, useState } from "react";
import { Bell, Trophy, AlertTriangle, CheckCircle } from "lucide-react";
import { notificationService } from "../../services/notificationService";
import type { NotificationPayload } from "../../types/notification";

type CardProps = {
  icon: any;
  title: string;
  value: number;
  variant?: "yellow" | "green" | "red" | "neutral";
};

function StatCard({ icon: Icon, title, value, variant = "neutral" }: CardProps) {
  const variants = {
    yellow: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
    green: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border border-red-500/20",
    neutral: "bg-white/5 text-gray-300 border border-white/10",
  };

  return (
    <div className="group relative bg-white/[0.02] border border-white/5 p-6 rounded-[1.8rem] backdrop-blur-2xl shadow-xl flex items-center gap-5 hover:bg-white/[0.05] hover:border-white/20 hover:scale-[1.03] transition-all duration-300 overflow-hidden">
      <div className={`p-3 rounded-2xl shadow-inner ${variants[variant]}`}>
        <Icon size={20} />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black">
          {title}
        </p>
        <p className="text-3xl font-black text-white tracking-tighter mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function StatsCards() {
  const [stats, setStats] = useState({
    total: 0,
    warning: 0,
    success: 0,
    performance: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data: NotificationPayload[] = await notificationService.getNotifications();
        
        const perfData = data.filter((n: NotificationPayload) => 
          n.focus?.toLowerCase().includes('rendimiento')
        );

        const rest = data.filter((n: NotificationPayload) => 
          !n.focus?.toLowerCase().includes('rendimiento')
        );

        setStats({
          total: data.length,
          performance: perfData.length,
          warning: rest.filter((n: NotificationPayload) => 
            n.type === 'warning' || n.type === 'error'
          ).length,
          success: rest.filter((n: NotificationPayload) => 
            n.type === 'success'
          ).length
        });
      } catch (error) {
        console.error("Error al cargar stats:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
      <StatCard
        icon={Bell}
        title="Total Alertas"
        value={stats.total}
        variant="neutral"
      />

      <StatCard
        icon={AlertTriangle}
        title="Críticas"
        value={stats.warning}
        variant="red"
      />

      <StatCard
        icon={Trophy}
        title="Excelencia"
        value={stats.performance}
        variant="yellow"
      />

      <StatCard
        icon={CheckCircle}
        title="Resueltas"
        value={stats.success}
        variant="green"
      />
    </div>
  );
}