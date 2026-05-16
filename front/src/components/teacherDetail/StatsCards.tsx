import {
  TrendingUp,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import type { TeacherStats } from "../../types/teacher";

export default function StatsCards({ teacher }: { teacher: TeacherStats | null }) {
  
  if (!teacher) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#0f111a]/50 border border-white/10 h-32 rounded-[2.5rem]" />
        ))}
      </div>
    );
  }

  const tendenciaValor = teacher.tendencia_mejora || "0.0%";
  
  const esNeutro = tendenciaValor === "0.0%";
  const esPositivo = !tendenciaValor.includes("-") && !tendenciaValor.toLowerCase().includes("baja");

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <div className="bg-[#0f111a]/50 border border-white/10 p-5 rounded-[2rem] backdrop-blur-2xl hover:border-emerald-500/30 transition-all">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">RECOMENDACIÓN</p>
          <CheckCircle size={16} className="text-emerald-400" />
        </div>
        <p className="text-3xl font-black text-white-400 uppercase tracking-tighter">
          {teacher.recomendado_vs_otros || "N/A"}
        </p>
      </div>

      <div className="bg-[#0f111a]/50 border border-white/10 p-5 rounded-[2rem] backdrop-blur-2xl hover:border-purple-500/30 transition-all">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">EVALUACIONES</p>
          <BookOpen size={16} className="text-purple-400" />
        </div>
        <p className="text-3xl font-black text-white-400">
          {teacher.evaluaciones_total || 0}
        </p>
      </div>

      <div className="bg-[#0f111a]/50 border border-white/10 p-5 rounded-[2rem] backdrop-blur-2xl hover:border-yellow-400/30 transition-all">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">TENDENCIA</p>
          <TrendingUp 
            size={16} 
            className={esNeutro ? "text-white-400" : (esPositivo ? "text-white-400" : "text-red-400")} 
          />
        </div>

        <p className={`text-3xl font-black uppercase tracking-tighter ${
          esNeutro ?  "text-white-400" : (esPositivo ? "text-white-400" : "text-red-400")
        }`}>
          {tendenciaValor}
        </p>
      </div>

    </div>
  );
}