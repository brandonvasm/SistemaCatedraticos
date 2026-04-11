import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

type Props = {
  course: any;
};

export default function CourseRow({ course }: Props) {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} size={12} fill="#facc15" color="#facc15" />);
      } else if (i - rating < 1) {
        stars.push(
          <Star key={i} size={12} fill="#facc15" color="#facc15" opacity={0.5} />
        );
      } else {
        stars.push(<Star key={i} size={12} color="#64748b" />);
      }
    }

    return stars;
  };

  return (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">

          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
            <BookOpen size={18} className="text-blue-400" />
          </div>

          <div>
            <p className="font-black text-[12px] uppercase tracking-widest text-white group-hover:text-yellow-400 transition">
              {course.name}
            </p>
            <p className="text-[11px] text-gray-500">
              {course.evaluations} evaluaciones
            </p>
          </div>

        </div>
      </td>

      <td className="px-6 py-4 text-center">
        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] text-gray-300 font-bold uppercase tracking-wider">
          {course.code}
        </span>
      </td>

      <td className="px-6 py-4 text-center text-gray-300 font-medium">
        {course.sections}
      </td>

      <td className="px-6 py-4 text-center text-gray-300 font-medium">
        {course.teachers}
      </td>

      <td className="px-6 py-4 text-center text-gray-300 font-medium">
        {course.students}
      </td>

      <td className="px-6 py-4 text-center">
        <div className="flex flex-col items-center">
          <p className="text-yellow-400 font-black text-xl">
            {course.avg}
          </p>
          <div className="flex gap-1 mt-1">
            {renderStars(course.avg)}
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-1 font-bold text-[12px]">
          {course.trend >= 0 ? (
            <TrendingUp size={16} className="text-emerald-400" />
          ) : (
            <TrendingDown size={16} className="text-red-400" />
          )}

          <span
            className={`${
              course.trend >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {course.trend}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-center text-emerald-400 font-bold text-[12px]">
        {course.rec}%
      </td>

      <td className="px-6 py-4 text-center text-gray-300 text-[12px]">
        {course.teacher}
      </td>

      <td className="px-6 py-4 text-right">
        <button
          onClick={() => navigate(`/cursos/${course.code}`)}
          className="
            px-4 py-2
            bg-white/5
            hover:bg-yellow-400/20
            border border-white/5
            hover:border-yellow-400/30
            text-yellow-400
            rounded-xl
            text-[11px]
            font-bold
            uppercase
            tracking-widest
            transition
            active:scale-90
          "
        >
          Ver Detalle
        </button>
      </td>
    </>
  );
}