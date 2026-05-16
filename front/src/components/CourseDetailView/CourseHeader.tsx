import { BookOpen, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CourseTable } from "../../types/courseTable";

interface CourseHeaderProps {
  course: CourseTable | null;
}

export default function CourseHeader({ course }: CourseHeaderProps) {
  if (!course) {
    return (
      <div className="bg-white/[0.02] border border-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] animate-pulse h-[140px]" />
    );
  }

  const isPositive = (course.trend || 0) >= 0;
  const isNeutral = course.trend === null;

  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        backdrop-blur-2xl
        p-8
        rounded-[2.5rem]
        flex flex-col md:flex-row justify-between items-center gap-6
        overflow-hidden
      "
    >
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex gap-5 items-center relative z-10">
        <div
          className="
            bg-blue-500/10
            p-4
            rounded-2xl
            border border-blue-500/20
            shadow-lg shadow-blue-500/10
          "
        >
          <BookOpen className="text-blue-400" size={22} />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">
            {course.name}
          </h1>

          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-3 ml-1">
            {course.code} 
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-2 font-black text-lg relative z-10 ${
        isNeutral ? "text-gray-500" : isPositive ? "text-emerald-400" : "text-red-400"
      }`}>
        {isNeutral ? (
          <Minus size={18} />
        ) : isPositive ? (
          <TrendingUp size={18} />
        ) : (
          <TrendingDown size={18} />
        )}
        
        <span className="tabular-nums">
          {course.trend !== null 
            ? `${isPositive ? '+' : ''}${course.trend.toFixed(1)}%` 
            : "—"
          }
        </span>
      </div>
    </div>
  );
}