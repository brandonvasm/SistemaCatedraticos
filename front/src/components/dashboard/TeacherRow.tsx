import { useNavigate } from "react-router-dom";
import type { Teacher } from "../../types/teacher";
import { renderStars } from "./renderStars";
import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
} from "lucide-react";

export const TeacherRow = ({ teacher }: { teacher: Teacher }) => {

  const navigate = useNavigate();

  return (
    <>
      {/* DOCENTE */}
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-bold text-white group-hover:text-yellow-400 transition">
            {teacher.name}
          </div>
          <div className="text-[11px] text-gray-500">
            Matemáticas Aplicadas
          </div>
        </div>
      </td>

      {/* CURSOS */}
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">

          <span className="bg-blue-500/10 text-blue-300 px-2 py-1 text-xs rounded-lg border border-blue-500/20">
            Cálculo I
          </span>

          <span className="bg-blue-500/10 text-blue-300 px-2 py-1 text-xs rounded-lg border border-blue-500/20">
            Cálculo II
          </span>

          {teacher.courses > 2 && (
            <span className="bg-white/5 text-gray-400 px-2 py-1 text-xs rounded-lg border border-white/10">
              +{teacher.courses - 2}
            </span>
          )}

        </div>
      </td>

      {/* SCORE */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <div className="flex">
            {renderStars(teacher.score, 12)}
          </div>

          <span className="text-white font-bold text-lg">
            {teacher.score}
          </span>
        </div>
      </td>

      {/* TREND */}
      <td className="px-6 py-4">
        <div
          className={`flex items-center gap-1 font-medium ${
            teacher.isTrendUp ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {teacher.isTrendUp ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownRight size={16} />
          )}
          {teacher.trend}
        </div>
      </td>

      {/* STUDENTS */}
      <td className="px-6 py-4 text-gray-300 font-medium">
        {teacher.students}
      </td>

      {/* RECOMENDADO */}
      <td className="px-8 py-5 text-emerald-400 font-semibold">
        {Math.round(teacher.score * 20)}%
      </td>

      {/* STATUS */}
      <td className="px-6 py-4">
        <span
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider w-fit border ${
            teacher.score >= 4.5
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : teacher.score >= 4
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          <CheckCircle size={12} />
          {teacher.score >= 4.5
            ? "Excelente"
            : teacher.score >= 4
            ? "Bueno"
            : "Bajo"}
        </span>
      </td>

      {/* ACCIONES */}
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => navigate(`/docentes/${teacher.id}`)}
          className="
            px-4 py-2
            bg-white/5
            hover:bg-yellow-400/20
            border border-white/5
            hover:border-yellow-400/30
            text-yellow-400
            rounded-xl
            text-sm
            transition
            active:scale-90
          "
        >
          Ver Detalle
        </button>
      </td>
    </>
  );
};