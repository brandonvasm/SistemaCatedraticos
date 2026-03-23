import { useNavigate } from "react-router-dom";
import type { Teacher } from "../../types/teacher";
import {
  ArrowUpRight,
  ArrowDownRight,
  Star,
  CheckCircle,
} from "lucide-react";

export const TeacherRow = ({ teacher }: { teacher: Teacher }) => {

  const navigate = useNavigate();
  const getStatus = () => {
    if (teacher.score >= 4.5) return "Excelente";
    if (teacher.score >= 4) return "Bueno";
    return "Bajo";
  };

  const status = getStatus();

  const statusStyles =
    status === "Excelente"
      ? "bg-green-500/20 text-green-400"
      : status === "Bueno"
        ? "bg-blue-500/20 text-blue-400"
        : "bg-red-500/20 text-red-400";

  return (
    <tr className="border-b border-slate-700 hover:bg-[#1e293b] transition">

      {/* DOCENTE */}
      <td className="p-4">
        <div className="text-sm md:text-base font-medium">
          {teacher.name}
        </div>
        <div className="text-xs md:text-sm text-gray-400">
          Matemáticas Aplicadas
        </div>
      </td>

      {/* CURSOS */}
      <td>
        <div className="flex flex-wrap gap-1 md:gap-2">
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 text-[10px] md:text-xs rounded-lg">
            Cálculo I
          </span>
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 text-[10px] md:text-xs rounded-lg">
            Cálculo II
          </span>
          {teacher.courses > 2 && (
            <span className="bg-slate-700 px-2 py-1 text-[10px] md:text-xs rounded-lg">
              +{teacher.courses - 2}
            </span>
          )}
        </div>
      </td>

      {/* PROMEDIO */}
      <td>
        <div className="flex flex-col">
          <div className="flex text-yellow-400 scale-90 md:scale-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(teacher.score) ? "currentColor" : "none"}
              />
            ))}
          </div>

          <span className="text-yellow-400 font-bold text-sm md:text-lg">
            {teacher.score}
          </span>
        </div>
      </td>

      {/* TENDENCIA */}
      <td>
        <div
          className={`flex items-center gap-1 font-medium ${teacher.isTrendUp ? "text-green-400" : "text-red-400"
            }`}
        >
          {teacher.isTrendUp ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {teacher.trend}
        </div>
      </td>

      {/* EVALUACIONES */}
      <td className="text-gray-300 font-medium">
        {teacher.students}
      </td>

      {/* RECOMENDADO */}
      <td className="text-green-400 font-semibold">
        {Math.round(teacher.score * 20)}%
      </td>

      {/* ESTADO */}
      <td>
        <span
          className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium w-fit ${statusStyles}`}
        >
          <CheckCircle size={12} />
          {status}
        </span>
      </td>

      {/* ACCIONES */}
      <td>
        <button
          onClick={() => navigate(`/teacher/${teacher.id}`)}
          className="bg-yellow-500/20 border border-yellow-400 text-yellow-300 px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm hover:bg-yellow-400 hover:text-black transition"
        >
          Ver Detalle
        </button>
      </td>
    </tr>
  );
};