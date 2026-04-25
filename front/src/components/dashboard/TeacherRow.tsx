import { useNavigate } from "react-router-dom";
import { renderStars } from "./renderStars";
import type { TeacherStats } from "../../types/teacher"; 
import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
} from "lucide-react";

export const TeacherRow = ({ teacher }: { teacher: TeacherStats }) => {
  const navigate = useNavigate();
  const isTrendUp = !teacher.tendencia_mejora.toLowerCase().includes("baja");

  return (
    <>
      <td className="px-6 py-5">
        <div>
          <div className="text-sm font-black text-white uppercase tracking-wide group-hover:text-yellow-400 transition">
            {teacher.teacher_name || "SIN NOMBRE"}
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex flex-wrap gap-2">
          {teacher.cursos_impartidos.length > 0 ? (
            <>
              {teacher.cursos_impartidos.slice(0, 2).map((curso, idx) => (
                <span key={idx} className="bg-blue-500/10 text-blue-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-blue-500/20">
                  {curso}
                </span>
              ))}
              {teacher.cursos_impartidos.length > 2 && (
                <span className="bg-white/5 text-gray-400 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border border-white/10">
                  +{teacher.cursos_impartidos.length - 2}
                </span>
              )}
            </>
          ) : (
            <span className="text-blue-400 font-black text-[11px] uppercase tracking-widest">
              No hay cursos
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex flex-col">
          <div className="flex">
            {renderStars(teacher.promedio_general, 12)}
          </div>
          <span className="text-white font-black text-xl">
            {teacher.promedio_general > 0 ? teacher.promedio_general.toFixed(2) : "0.00"}
          </span>
        </div>
      </td>

      <td className="px-6 py-5">
        {teacher.tendencia_mejora ? (
          <div
            className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest ${
              isTrendUp ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isTrendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {teacher.tendencia_mejora}
          </div>
        ) : (
          <span className="text-blue-400 font-black text-[11px] uppercase tracking-widest">
            Sin Tendencia
          </span>
        )}
      </td>

      <td className="px-6 py-5">
        <span className="text-gray-300 font-bold text-[11px] uppercase tracking-widest">
          {teacher.evaluaciones_total > 0 ? `${teacher.evaluaciones_total} Evals` : (
            <span className="text-blue-400 font-black text-[11px] uppercase tracking-widest">
              Sin Evals
            </span>
          )}
        </span>
      </td>

      <td className="px-8 py-5 text-blue-400 font-black text-[11px] uppercase tracking-widest">
        {teacher.recomendado_vs_otros || "SIN DATOS"}
      </td>

      <td className="px-6 py-5">
        <span
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest w-fit border ${
            teacher.promedio_general >= 4.5
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : teacher.promedio_general >= 4
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          <CheckCircle size={12} />
          {teacher.promedio_general >= 4.5
            ? "Excelente"
            : teacher.promedio_general >= 4
            ? "Bueno"
            : "Bajo"}
        </span>
      </td>

      <td className="px-6 py-5 text-right">
        <button
          onClick={() => navigate(`/docentes/${teacher.teacher_id}`)}
          className="px-6 py-3 bg-white/5 hover:bg-yellow-400/20 border border-white/5 hover:border-yellow-400/30 text-yellow-400 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          Detalle
        </button>
      </td>
    </>
  );
};