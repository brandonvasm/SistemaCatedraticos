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

  const getStatus = () => {
    if (teacher.score >= 4.5) return "Excelente";
    if (teacher.score >= 4) return "Bueno";
    return "Bajo";
  };

  const status = getStatus();

  const statusStyles =
    status === "Excelente"
      ? "bg-emerald-500/10 text-emerald-400"
      : status === "Bueno"
        ? "bg-blue-500/10 text-blue-400"
        : "bg-red-500/10 text-red-400";

  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition-all duration-200">

      <td className="p-4">
        <div className="text-sm md:text-base font-medium text-gray-200">
          {teacher.name}
        </div>
        <div className="text-xs md:text-sm text-gray-500">
          Matemáticas Aplicadas
        </div>
      </td>

      <td>
        <div className="flex flex-wrap gap-1 md:gap-2">

          <span className="bg-blue-500/10 text-blue-300 px-2 py-1 text-[10px] md:text-xs rounded-lg border border-blue-500/20">
            Cálculo I
          </span>

          <span className="bg-blue-500/10 text-blue-300 px-2 py-1 text-[10px] md:text-xs rounded-lg border border-blue-500/20">
            Cálculo II
          </span>

          {teacher.courses > 2 && (
            <span className="bg-white/5 text-gray-400 px-2 py-1 text-[10px] md:text-xs rounded-lg border border-white/10">
              +{teacher.courses - 2}
            </span>
          )}

        </div>
      </td>

      <td>
        <div className="flex flex-col">

          <div className="flex scale-90 md:scale-100">
            {renderStars(teacher.score, 12)}
          </div>

          <span className="text-gray-200 font-bold text-sm md:text-lg">
            {teacher.score}
          </span>
        </div>
      </td>

      <td>
        <div
          className={`flex items-center gap-1 font-medium ${teacher.isTrendUp ? "text-emerald-400" : "text-red-400"
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

      <td className="text-gray-300 font-medium">
        {teacher.students}
      </td>

      <td className="text-emerald-400 font-semibold">
        {Math.round(teacher.score * 20)}%
      </td>

      <td>
        <span
          className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium w-fit ${statusStyles}`}
        >
          <CheckCircle size={12} />
          {status}
        </span>
      </td>

      <td>
        <button
          onClick={() => navigate(`/teacher/${teacher.id}`)}
          className="
            bg-white/5
            border border-white/10
            text-gray-300
            px-2 md:px-4 py-1 md:py-2
            rounded-lg text-xs md:text-sm
            hover:bg-white/10 hover:text-white
            transition
          "
        >
          Ver Detalle
        </button>
      </td>

    </tr>
  );
};