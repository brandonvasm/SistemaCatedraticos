import { useEffect, useState, useMemo } from "react";
import { Bell, Trophy, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { NotificationPayload } from "../../types/notification";

type VariantType = "yellow" | "green" | "red" | "neutral";


type StatCardProps = {
  icon: React.ElementType;
  title: string;
  value: number;
  variant?: VariantType; 
};

function StatCard({ icon: Icon, title, value, variant = "neutral" }: StatCardProps) {
  const variants: Record<VariantType, string> = {
    yellow: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
    green: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border border-red-500/20",
    neutral: "bg-white/5 text-gray-300 border border-white/10",
  };

  return (
    <div className="group relative bg-white/[0.02] border border-white/5 p-4 sm:p-6 rounded-[1.5rem] backdrop-blur-2xl shadow-xl flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${variants[variant]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black">{title}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
    </div>
  );
}

export default function StatsCards({ notifications }: { notifications?: NotificationPayload[] }) {
  const { user } = useAuth();
  const [data, setData] = useState<NotificationPayload[]>([]);

  useEffect(() => {
    if (notifications) {
      setData(notifications);
    }
  }, [notifications]);

  const stats = useMemo(() => {
    if (!user?.id) return { total: 0, warning: 0, success: 0, performance: 0 };

    const userNotifications = data.filter((n) => {
      const notificationUserId = (n.user as any)?.id || n.user;
      return Number(notificationUserId) === Number(user.id);
    });

    return userNotifications.reduce((acc, n) => {
      const focus = n.focus?.toLowerCase() || "";
      const subject = n.subject?.toLowerCase() || "";
      if (focus.includes('rendimiento') || subject.includes('excelencia')) acc.performance++;
      else if (n.type === 'warning' || n.type === 'error' || focus.includes('critica')) acc.warning++;
      else acc.success++;
      return acc;
    }, { total: userNotifications.length, warning: 0, success: 0, performance: 0 });
  }, [data, user?.id]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
      <StatCard icon={Bell} title="Total Alertas" value={stats.total} variant="neutral" />
      <StatCard icon={AlertTriangle} title="Críticas" value={stats.warning} variant="red" />
      <StatCard icon={Trophy} title="Excelencia" value={stats.performance} variant="yellow" />
      <StatCard icon={CheckCircle} title="Resueltas" value={stats.success} variant="green" />
    </div>
  );
}