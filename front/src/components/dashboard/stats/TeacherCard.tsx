import Card from "../../ui/Card";
import type { TeacherStats } from "../../../types/teacher";
import { TrendingUp, TrendingDown } from "lucide-react";
import { renderStars } from "../renderStars";

export default function TeacherCard({ teacher }: { teacher: TeacherStats }) {
  const promedio = teacher?.promedio_general ?? 0;
  const isLow = promedio < 65;
  
  const isTrendUp = promedio >= 65;

  return (
    <Card className="hover:bg-white/5 transition-all duration-300 group cursor-pointer border-white/5 bg-white/[0.02] w-full">
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-200 group-hover:text-yellow-400 transition-colors tracking-wide break-words text-sm sm:text-base">
            {teacher?.teacher_name || "Sin Nombre"}
          </h3>
        </div>
        <div className={promedio > 0 ? (isTrendUp ? "text-emerald-400" : "text-red-400") : "text-gray-500"}>
          {promedio > 0 ? (
            isTrendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />
          ) : (
            <TrendingUp size={16} className="opacity-20" />
          )}
        </div>
      </div>

      <div className="flex gap-1 mt-3 flex-wrap">
        {promedio > 0 ? (
          renderStars(promedio, 12)
        ) : (
          <div className="flex gap-1">
             {renderStars(0, 12)}
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6 flex justify-between items-end gap-2 flex-wrap">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest whitespace-nowrap">
          {teacher?.cursos_impartidos?.length > 0 ? (
            `${teacher.cursos_impartidos.length} cursos`
          ) : (
            "0 cursos"
          )}
        </span>
        <div className="text-right min-w-[70px]">
          <span className={`text-2xl sm:text-3xl font-bold tracking-tighter block leading-none ${promedio > 0 ? (isLow ? 'text-red-500' : 'text-emerald-400') : 'text-gray-600'}`}>
            {promedio > 0 ? promedio.toFixed(1) : "0.0"}
          </span>
          <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest block mt-1 ${promedio > 0 ? (isTrendUp ? 'text-emerald-400' : 'text-red-400') : 'text-gray-500'}`}>
            {teacher?.tendencia_mejora || "Sin tendencia"}
          </span>
        </div>
      </div>
    </Card>
  );
}