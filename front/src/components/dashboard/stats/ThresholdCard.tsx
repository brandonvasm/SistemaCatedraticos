import { Target, TrendingUp } from "lucide-react";
import type { TeacherStats } from "../../../types/teacher";

interface ThresholdCardProps {
  teachers: TeacherStats[];
}

export default function ThresholdCard({ teachers }: ThresholdCardProps) {
  const total = teachers.length;
  const highPerformers = teachers.filter(t => t.promedio_general >= 85).length;
  const percentage = total > 0 ? Math.round((highPerformers / total) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-[#1e2b4a]/60 to-[#111827]/40 border border-blue-500/20 p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="flex items-center gap-2 text-blue-400 mb-4 self-start relative z-10">
        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <Target size={20} />
        </div>
        <h3 className="font-bold tracking-tight text-sm"> Sobre 85 Puntos</h3>
      </div>

      <div className="flex items-baseline relative z-10">
        <span className="text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          {highPerformers}
        </span>
        <span className="text-2xl text-gray-600 font-bold ml-1">/{total}</span>
      </div>

      <p className="text-[10px] text-blue-300/70 font-black mt-2 uppercase tracking-[0.2em] relative z-10">
        DOCENTES CALIFICADOS
      </p>

      <div className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-500/10 py-2 rounded-full border border-blue-500/20 text-[10px] text-blue-400 font-bold uppercase tracking-widest relative z-10">
        <TrendingUp size={14} /> {percentage}% DEL TOTAL ACTUAL
      </div>
    </div>
  );
}