import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Star,
  TrendingUp,
  TrendingDown,
  Eye,
} from "lucide-react";
import type { CourseTable } from "../../types/courseTable";

type Props = {
  course: CourseTable;
};

export default function CourseRow({ course }: Props) {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    const stars = [];
    const normalizedRating = rating / 20; 

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(normalizedRating)) {
        stars.push(<Star key={i} size={10} fill="#facc15" color="#facc15" />);
      } else if (i - normalizedRating < 1) {
        stars.push(
          <Star key={i} size={10} fill="#facc15" color="#facc15" opacity={0.5} />
        );
      } else {
        stars.push(<Star key={i} size={10} color="#334155" />);
      }
    }
    return stars;
  };

  return (
    <>
      <td className="px-6 py-5 w-[300px]">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-400/10 border border-yellow-400/20 p-2.5 rounded-xl">
            <BookOpen size={16} className="text-yellow-400" />
          </div>
          <div className="overflow-hidden">
            <p className="font-black text-[11px] uppercase tracking-wider text-white group-hover:text-yellow-400 transition truncate">
              {course.name}
            </p>
            <div className="flex gap-0.5 mt-1">
              {renderStars(course.score)}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-5 w-[140px] text-center">
        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] text-gray-400 font-mono tracking-widest uppercase">
          {course.code}
        </span>
      </td>

      <td className="px-6 py-5 w-[100px] text-center text-gray-400 font-bold text-[11px]">
        {course.credits}
      </td>

      <td className="px-6 py-5 w-[120px] text-center">
        <div className="inline-flex flex-col items-center bg-yellow-400/5 px-4 py-1.5 rounded-2xl border border-yellow-400/10">
          <span className="text-yellow-400 font-black text-sm ">
            {course.score?.toFixed(1) || "0.0"}
          </span>
        </div>
      </td>

      <td className="px-6 py-5 w-[120px] text-center">
        {course.trend !== null ? (
          <div className="flex items-center justify-center gap-1.5 font-black text-[10px]">
            {course.trend >= 0 ? (
              <TrendingUp size={14} className="text-emerald-400" />
            ) : (
              <TrendingDown size={14} className="text-red-400" />
            )}
            <span className={course.trend >= 0 ? "text-emerald-400" : "text-red-400"}>
              {Math.abs(course.trend).toFixed(1)}%
            </span>
          </div>
        ) : (
          <span className="text-gray-700 font-black text-[10px] tracking-widest">—</span>
        )}
      </td>

      <td className="px-6 py-5 w-[120px] text-right">
        <button
          onClick={() => navigate(`/cursos/${course.id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-yellow-400 border border-white/5 hover:border-yellow-400 text-white hover:text-black rounded-xl transition-all duration-300 group/btn shadow-xl active:scale-95"
        >
          <Eye size={12} className="transition-transform group-hover/btn:scale-110" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Ver Detalle
          </span>
        </button>
      </td>
    </>
  );
}