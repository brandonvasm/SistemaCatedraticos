import { useNavigate } from "react-router-dom";
import { renderStars } from "./renderStars";
import { Eye, ArrowUpRight, ArrowDownRight, CheckCircle } from "lucide-react";
import type { TeacherStats } from "../../types/teacher"; 

export const TeacherRow = ({ teacher }: { teacher: TeacherStats }) => {
  const navigate = useNavigate();

  const tendenciaStr = teacher.tendencia_mejora || "";
  const isTrendUp = 
    !tendenciaStr.includes("-");

  return (
    <>
      <td className="px-6 py-5 w-[280px]">
        <div>
          <div className="text-sm font-black text-white uppercase tracking-wide group-hover:text-yellow-400 transition whitespace-nowrap">
            {teacher.teacher_name || "SIN NOMBRE"}
          </div>
        </div>
      </td>

      <td className="px-6 py-5 w-[400px]">
        <div className="flex flex-nowrap gap-2 overflow-hidden">
          {teacher.cursos_impartidos && teacher.cursos_impartidos.length > 0 ? (
            <>
              {teacher.cursos_impartidos.slice(0, 2).map((curso, idx) => (
                <span key={idx} className="bg-blue-500/10 text-blue-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-blue-500/20 whitespace-nowrap">
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
            <span className="text-gray-600 font-bold text-[10px] uppercase tracking-widest">
              Sin cursos asignados
            </span>
          )}
        </div>
      </td>


      <td className="px-6 py-5">
        <div className="flex flex-col leading-tight">
          <div className="flex mb-1">
            {renderStars(teacher.promedio_general, 12)}
          </div>
          <span className="text-white font-black text-xl">
            {teacher.promedio_general > 0 ? teacher.promedio_general.toFixed(2) : "0.00"}
          </span>
        </div>
      </td>

      <td className="px-6 py-5">
        {tendenciaStr ? (
          <div
            className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest ${
              isTrendUp ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isTrendUp ? (
              <ArrowUpRight size={16} strokeWidth={2.5} />
            ) : (
              <ArrowDownRight size={16} strokeWidth={2.5} />
            )}
            {tendenciaStr}
          </div>
        ) : (
          <span className="text-gray-600 font-bold text-[10px] uppercase tracking-widest">
            Estable
          </span>
        )}
      </td>

      <td className="px-6 py-5">
        <span className="text-gray-300 font-bold text-[11px] uppercase tracking-widest">
          {teacher.evaluaciones_total > 0 ? (
            `${teacher.evaluaciones_total} Evals`
          ) : (
            <span className="text-gray-600">0 Evals</span>
          )}
        </span>
      </td>

      <td className="px-8 py-5 text-blue-400 font-black text-[11px] uppercase tracking-widest">
        {teacher.recomendado_vs_otros || "SIN DATOS"}
      </td>

      <td className="px-6 py-5">
        <span
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest w-fit border ${
            teacher.promedio_general >= 80
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : teacher.promedio_general >= 65
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          <CheckCircle size={12} />
          {teacher.promedio_general >= 80
            ? "Excelente"
            : teacher.promedio_general >= 65
            ? "Bueno"
            : "Bajo"}
        </span>
      </td>

      <td className="px-6 py-5 w-[120px] text-right">
        <button
          onClick={() => navigate(`/docentes/${teacher.teacher_id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-yellow-400 border border-white/5 hover:border-yellow-400 text-white hover:text-black rounded-xl transition-all duration-300 group/btn shadow-xl active:scale-95"
        >
          <Eye size={12} className="transition-transform group-hover/btn:scale-110" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Detalle
          </span>
        </button>
      </td>
    </>
  );
};