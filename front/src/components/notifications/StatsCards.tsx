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
      bg-white/[0.02]
      border border-white/10
      p-6
      rounded-[1.8rem]
      backdrop-blur-2xl
      shadow-xl
      flex items-center gap-5
      hover:bg-white/10
      hover:border-white/20
      hover:scale-[1.02]
      transition-all duration-300
    ">

      <div className={`
        p-3
        rounded-2xl
        border
        ${color}
        shadow-inner
      `}>
        <Icon size={20} />
      </div>

      <div>
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
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">

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