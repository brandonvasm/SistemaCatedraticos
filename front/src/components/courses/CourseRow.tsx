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
    <tr className="border-b border-white/5 hover:bg-white/5 transition">

      <td className="p-4">
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

      <td className="p-4">
        <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-gray-300">
          {course.code}
        </span>
      </td>

      <td className="p-4 text-gray-300">{course.sections}</td>
      <td className="p-4 text-gray-300">{course.teachers}</td>
      <td className="p-4 text-gray-300">{course.students}</td>

      <td className="p-4">
        <p className="text-yellow-400 font-bold text-lg">
          {course.avg}
        </p>
        <div className="flex gap-1 mt-1">
          {renderStars(course.avg)}
        </div>
      </td>

      <td className="p-4 flex items-center gap-1">
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
      </td>

      <td className="p-4 text-emerald-400 font-semibold">
        {course.rec}%
      </td>

      <td className="p-4 text-gray-300">{course.teacher}</td>

      <td className="p-4">
        <button
          onClick={() => navigate(`/cursos/${course.code}`)}
          className="
            bg-blue-500/10
            border border-blue-500/20
            text-blue-300
            px-3 py-1
            rounded-lg
            text-xs
            hover:bg-blue-400
            hover:text-black
            transition
          "
        >
          Ver
        </button>
      </td>

    </tr>
  );
}