type Course = {
  name: string;
  score: number;
};

const courses: Course[] = [
  { name: "Cálculo I", score: 4.9 },
  { name: "Cálculo II", score: 4.7 },
  { name: "Álgebra Lineal", score: 4.3 },
];

export default function CoursesList() {

  const getStatus = (score: number) => {
    if (score >= 4.5) return { label: "Excelente", color: "text-emerald-400" };
    if (score >= 4) return { label: "Bueno", color: "text-blue-400" };
    return { label: "Bajo", color: "text-red-400" };
  };

  return (
    <div
      className="
        p-6
        rounded-2xl
        backdrop-blur-2xl
        shadow-xl
      "
    >
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Cursos
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Desempeño por curso
        </p>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {courses.map((course, i) => {
          const status = getStatus(course.score);

          return (
            <div
              key={i}
              className="
        bg-[#0f111a]/50
                border border-white/10
                p-4
                rounded-xl
                hover:bg-white/10
                hover:border-white/20
                transition-all
              "
            >
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Curso
              </p>

              <p className="text-white font-semibold">
                {course.name}
              </p>

              <div className="flex items-center justify-between mt-3">

                <span className="text-yellow-400 font-bold text-lg">
                  {course.score}
                </span>

                <span className={`text-xs font-semibold ${status.color}`}>
                  {status.label}
                </span>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}