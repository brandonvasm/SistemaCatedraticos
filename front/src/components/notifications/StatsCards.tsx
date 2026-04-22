import { Bell, Eye, AlertTriangle, CheckCircle } from "lucide-react";

type CardProps = {
  icon: any;
  title: string;
  value: number;
  variant?: "yellow" | "green" | "red" | "neutral";
};

function StatCard({ icon: Icon, title, value, variant = "neutral" }: CardProps) {
  const variants = {
    yellow:
      "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
    green:
      "bg-green-500/10 text-green-500 border border-green-500/20",
    red:
      "bg-red-500/10 text-red-400 border border-red-500/20",
    neutral:
      "bg-white/5 text-gray-300 border border-white/10",
  };

  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[1.8rem]
        backdrop-blur-2xl
        shadow-xl
        flex items-center gap-5
        hover:bg-white/[0.05]
        hover:border-white/20
        hover:scale-[1.03]
        transition-all duration-300
        overflow-hidden
      "
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div
        className={`
          p-3
          rounded-2xl
          shadow-inner
          ${variants[variant]}
        `}
      >
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
        variant="neutral"
      />

      <StatCard
        icon={Eye}
        title="No Leídas"
        value={3}
        variant="yellow"
      />

      <StatCard
        icon={AlertTriangle}
        title="Requieren Acción"
        value={3}
        variant="red"
      />

      <StatCard
        icon={CheckCircle}
        title="Resueltas Hoy"
        value={12}
        variant="green"
      />
    </div>
  );
}