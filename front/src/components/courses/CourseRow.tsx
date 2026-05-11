import { useNavigate } from "react-router-dom";
import { BookOpen, Star, TrendingUp, TrendingDown, Eye, Minus } from "lucide-react"; 
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
        stars.push(<Star key={i} size={10} fill="#facc15" color="#facc15" opacity={0.5} />);
      } else {
        stars.push(<Star key={i} size={10} color="#334155" />);
      }
    }
    return stars;
  };

  return (
    <>
      <td className="px-6 py-5 w-[280px]">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-400/10 border border-yellow-400/20 p-2.5 rounded-xl shrink-0">
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

      <td className="px-6 py-5 w-[220px] text-center">
        <div className="flex flex-wrap justify-center gap-1.5 max-w-[200px] mx-auto">
          {course.careers && course.careers.length > 0 ? (
            <>
              {course.careers.slice(0, 1).map((career) => (
                <span key={career.id} className="px-2.5 py-1 bg-white/[0.03] border border-white/10 rounded-lg text-[8px] font-black text-gray-400 uppercase tracking-widest">
                  {career.name}
                </span>
              ))}
              {course.careers.length > 1 && (
                <div className="group/tooltip relative cursor-help">
                  <span className="px-2.5 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-[8px] font-black text-yellow-400 uppercase tracking-widest">
                    +{course.careers.length - 1}
                  </span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#0b101f] border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all z-50">
                    <p className="text-[7px] text-gray-500 font-black uppercase mb-2 border-b border-white/5 pb-1">Carreras Asociadas</p>
                    <div className="flex flex-col gap-1.5 text-left">
                      {course.careers.slice(1).map(c => (
                        <span key={c.id} className="text-[9px] text-white font-bold">• {c.name}</span>
                      ))}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0b101f] border-r border-b border-white/10 rotate-45"></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <span className="text-[9px] font-bold text-gray-700 uppercase">General</span>
          )}
        </div>
      </td>

      <td className="px-6 py-5 w-[140px] text-center">
        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] text-gray-400 font-mono tracking-widest">
          {course.code}
        </span>
      </td>

      <td className="px-6 py-5 w-[100px] text-center text-gray-400 font-bold text-[11px]">
        {course.credits}
      </td>

      <td className="px-6 py-5 w-[120px] text-center">
        <div className="inline-flex flex-col items-center bg-yellow-400/5 px-4 py-1.5 rounded-2xl border border-yellow-400/10">
          <span className="text-yellow-400 font-black text-sm">
            {course.score?.toFixed(1) || "0.0"}
          </span>
        </div>
      </td>

      <td className="px-6 py-5 w-[120px] text-center">
        {course.trend !== null ? (
          <div className={`flex items-center justify-center gap-1.5 font-black text-[10px] px-3 py-1 rounded-full ${
            course.trend > 0 ? "text-emerald-400 bg-emerald-400/5" : 
            course.trend < 0 ? "text-rose-400 bg-rose-400/5" : 
            "text-gray-500 bg-gray-500/5"
          }`}>
            {course.trend > 0 && <TrendingUp size={14} strokeWidth={3} />}
            {course.trend < 0 && <TrendingDown size={14} strokeWidth={3} />}
            {course.trend === 0 && <Minus size={14} strokeWidth={3} />}
            
            <span>{Math.abs(course.trend).toFixed(1)}%</span>
          </div>
        ) : (
          <span className="text-gray-700 font-black text-[10px]">—</span>
        )}
      </td>

      <td className="px-6 py-5 w-[140px] text-right">
        <button
          onClick={() => navigate(`/cursos/${course.id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-yellow-400 border border-white/5 hover:border-yellow-400 text-white hover:text-black rounded-xl transition-all duration-300 group/btn active:scale-95 shadow-xl"
        >
          <Eye size={12} className="group-hover/btn:scale-110" />
          <span className="text-[9px] font-black uppercase tracking-widest">Detalle</span>
        </button>
      </td>
    </>
  );
}