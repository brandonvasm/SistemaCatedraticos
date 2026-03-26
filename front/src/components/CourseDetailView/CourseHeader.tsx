import { BookOpen, TrendingUp } from "lucide-react";

export default function CourseHeader() {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl flex justify-between items-center">

      <div className="flex gap-4 items-center">
        <div className="bg-blue-500/20 p-3 rounded-xl">
          <BookOpen className="text-blue-400" />
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-200">
            Ingeniería de Software
          </h1>
          <p className="text-gray-400 text-sm">
            Curso enfocado en metodologías ágiles...
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-green-400 font-semibold">
        <TrendingUp size={16} />
        +0.4
      </div>

    </div>
  );
}