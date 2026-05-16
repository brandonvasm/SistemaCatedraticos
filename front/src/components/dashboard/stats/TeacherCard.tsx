import Card from "../../ui/Card";
import type { TeacherStats } from "../../../types/teacher";
import { TrendingUp, TrendingDown } from "lucide-react";
import { renderStars } from "../renderStars";

export default function TeacherCard({ teacher }: { teacher: TeacherStats }) {
  const isLow = (teacher?.promedio_general ?? 0) < 4.0;
  const isTrendUp = teacher?.tendencia_mejora && !teacher.tendencia_mejora.toLowerCase().includes("baja");

  return (
    <Card className="hover:bg-white/5 transition-all duration-300 group cursor-pointer border-white/5 bg-white/[0.02]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-200 group-hover:text-yellow-400 transition-colors tracking-wide">
            {teacher?.teacher_name || "Sin Nombre"}
          </h3>
        </div>
        <div className={teacher?.tendencia_mejora ? (isTrendUp ? "text-emerald-400" : "text-red-400") : "text-gray-500"}>
          {teacher?.tendencia_mejora ? (
            isTrendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />
          ) : (
            <TrendingUp size={16} className="opacity-20" />
          )}
        </div>
      </div>

      <div className="flex gap-1 mt-3">
        {teacher?.promedio_general > 0 ? (
          renderStars(teacher.promedio_general, 12)
        ) : (
          <div className="flex gap-1">
             {renderStars(0, 12)}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-end">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          {teacher?.cursos_impartidos?.length > 0 ? (
            `${teacher.cursos_impartidos.length} cursos`
          ) : (
            "0 cursos"
          )}
        </span>
        <div className="text-right">
          <span className={`text-3xl font-bold tracking-tighter block leading-none ${teacher?.promedio_general > 0 ? (isLow ? 'text-red-500' : 'text-emerald-400') : 'text-gray-600'}`}>
            {teacher?.promedio_general > 0 ? teacher.promedio_general.toFixed(1) : "0.0"}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${teacher?.tendencia_mejora ? (isTrendUp ? 'text-emerald-400' : 'text-red-400') : 'text-gray-500'}`}>
            {teacher?.tendencia_mejora || "Sin tendencia"}
          </span>
        </div>
      </div>
    </Card>
  );
}