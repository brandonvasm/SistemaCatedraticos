import { Bell, Eye, AlertTriangle, CheckCircle } from "lucide-react";

type CardProps = {
  icon: any;
  title: string;
  value: number;
  color: string;
};

function StatCard({ icon: Icon, title, value, color }: CardProps) {
  return (
    <div className="bg-[#1c2746] p-5 rounded-xl flex items-center gap-4">

      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>

      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>

    </div>
  );
}

export default function StatsCards() {
  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">

      <StatCard
        icon={Bell}
        title="Total"
        value={8}
        color="bg-blue-500/20 text-blue-400"
      />

      <StatCard
        icon={Eye}
        title="No Leídas"
        value={3}
        color="bg-yellow-500/20 text-yellow-400"
      />

      <StatCard
        icon={AlertTriangle}
        title="Requieren Acción"
        value={3}
        color="bg-red-500/20 text-red-400"
      />

      <StatCard
        icon={CheckCircle}
        title="Resueltas Hoy"
        value={12}
        color="bg-green-500/20 text-green-400"
      />

    </div>
  );
}