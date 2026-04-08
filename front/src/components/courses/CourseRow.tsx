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
        stars.push(<Star key={i} size={14} fill="#facc15" color="#facc15" />);
      } else if (i - rating < 1) {
        stars.push(
          <Star key={i} size={14} fill="#facc15" color="#facc15" opacity={0.5} />
        );
      } else {
        stars.push(<Star key={i} size={14} color="#64748b" />);
      }
    }

    return stars;
  };

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.03] transition-all">

      {/* CURSO (izquierda) */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">

          <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg">
            <BookOpen size={18} className="text-blue-400" />
          </div>

          <div>
            <p className="font-semibold text-gray-200">{course.name}</p>
            <p className="text-xs text-gray-400">
              {course.evaluations} evaluaciones
            </p>
          </div>

        </div>
      </td>

      {/* CODIGO */}
      <td className="px-6 py-4 text-center">
        <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-gray-300">
          {course.code}
        </span>
      </td>

      {/* NUMERICOS CENTRADOS */}
      <td className="px-6 py-4 text-center text-gray-300">
        {course.sections}
      </td>

      <td className="px-6 py-4 text-center text-gray-300">
        {course.teachers}
      </td>

      <td className="px-6 py-4 text-center text-gray-300">
        {course.students}
      </td>

      {/* PROMEDIO */}
      <td className="px-6 py-4 text-center">
        <div className="flex flex-col items-center">
          <p className="text-yellow-400 font-bold text-lg">
            {course.avg}
          </p>
          <div className="flex gap-1 mt-1">
            {renderStars(course.avg)}
          </div>
        </div>
      </td>

      {/* TENDENCIA */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-1">
          {course.trend >= 0 ? (
            <TrendingUp size={16} className="text-emerald-400" />
          ) : (
            <TrendingDown size={16} className="text-red-400" />
          )}

          <span
            className={`font-semibold ${
              course.trend >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {course.trend}
          </span>
        </div>
      </td>

      {/* RECOMENDADO */}
      <td className="px-6 py-4 text-center text-emerald-400 font-semibold">
        {course.rec}%
      </td>

      {/* DOCENTE */}
      <td className="px-6 py-4 text-center text-gray-300">
        {course.teacher}
      </td>

      {/* ACCIONES */}
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => navigate(`/cursos/${course.code}`)}
          className="
            bg-blue-500/10
            border border-blue-500/20
            text-blue-300
            px-3 py-1.5
            rounded-lg
            text-xs
            hover:bg-blue-400
            hover:text-black
            transition-all
          "
        >
          Ver
        </button>
      </td>

    </tr>
  );
}