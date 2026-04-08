import {
  TrendingUp,
  Users,
  BookOpen,
  CheckCircle,
} from "lucide-react";

export default function StatsCards({ teacher }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {/* RECOMENDACIÓN */}
      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-4 rounded-2xl
        backdrop-blur-2xl
        hover:border-emerald-500/30
        transition
      ">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            Recomendación
          </p>

          <CheckCircle size={16} className="text-emerald-400" />
        </div>

        <p className="text-2xl font-bold text-emerald-400">
          {Math.round(teacher.score * 20)}%
        </p>
      </div>

      {/* ESTUDIANTES */}
      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-4 rounded-2xl
        backdrop-blur-2xl
        hover:border-blue-500/30
        transition
      ">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            Estudiantes
          </p>

          <Users size={16} className="text-blue-400" />
        </div>

        <p className="text-2xl font-bold text-white">
          {teacher.students}
        </p>
      </div>

      {/* CURSOS */}
      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-4 rounded-2xl
        backdrop-blur-2xl
        hover:border-purple-500/30
        transition
      ">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            Cursos
          </p>

          <BookOpen size={16} className="text-purple-400" />
        </div>

        <p className="text-2xl font-bold text-purple-400">
          {teacher.courses}
        </p>
      </div>

      {/* TENDENCIA */}
      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-4 rounded-2xl
        backdrop-blur-2xl
        hover:border-yellow-400/30
        transition
      ">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            Tendencia
          </p>

          <TrendingUp size={16} className="text-yellow-400" />
        </div>

        <p className="text-sm font-bold text-yellow-400">
          ↑ Mejorando
        </p>
      </div>

    </div>
  );
}