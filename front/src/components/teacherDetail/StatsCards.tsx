import {
  TrendingUp,
  BookOpen,
  CheckCircle,
} from "lucide-react";

export default function StatsCards({ teacher }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-5 rounded-[2rem]
        backdrop-blur-2xl
        hover:border-emerald-500/30
        transition-all
      ">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">
            RECOMENDACIÓN
          </p>

          <CheckCircle size={16} className="text-emerald-400" />
        </div>

        <p className="text-3xl font-black text-emerald-400">
          {Math.round(teacher.score * 20)}%
        </p>
      </div>

      

      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-5 rounded-[2rem]
        backdrop-blur-2xl
        hover:border-purple-500/30
        transition-all
      ">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">
            CURSOS
          </p>

          <BookOpen size={16} className="text-purple-400" />
        </div>

        <p className="text-3xl font-black text-purple-400">
          {teacher.courses}
        </p>
      </div>

      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-5 rounded-[2rem]
        backdrop-blur-2xl
        hover:border-yellow-400/30
        transition-all
      ">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">
            TENDENCIA
          </p>

          <TrendingUp size={16} className="text-yellow-400" />
        </div>

        <p className="text-[11px] font-black uppercase tracking-widest text-yellow-400">
          ↑ MEJORANDO
        </p>
      </div>

    </div>
  );
}