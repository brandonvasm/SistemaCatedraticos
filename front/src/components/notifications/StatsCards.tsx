import { Bell, Eye, AlertTriangle, CheckCircle } from "lucide-react";

type CardProps = {
  icon: any;
  title: string;
  value: number;
  color: string;
};

function StatCard({ icon: Icon, title, value, color }: CardProps) {
  return (
    <div className="
      bg-[#0f111a]/50
      border border-white/10
      p-5
      rounded-2xl
      backdrop-blur-2xl
      shadow-xl
      flex items-center gap-4
      hover:bg-white/[0.04]
      hover:border-white/20
      transition-all
    ">

      {/* ICON */}
      <div className={`
        p-3
        rounded-xl
        border
        ${color}
      `}>
        <Icon size={20} />
      </div>

      {/* TEXT */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
          {title}
        </p>

        <p className="text-2xl font-bold text-gray-200 tracking-tight">
          {value}
        </p>
      </div>

    </div>
  );
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

      <StatCard
        icon={Bell}
        title="Total"
        value={8}
        color="bg-blue-500/10 text-blue-400 border-blue-500/20"
      />

      <StatCard
        icon={Eye}
        title="No Leídas"
        value={3}
        color="bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      />

      <StatCard
        icon={AlertTriangle}
        title="Requieren Acción"
        value={3}
        color="bg-red-500/10 text-red-400 border-red-500/20"
      />

      <StatCard
        icon={CheckCircle}
        title="Resueltas Hoy"
        value={12}
        color="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      />

    </div>
  );
}