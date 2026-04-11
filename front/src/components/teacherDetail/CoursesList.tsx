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
        p-8
        rounded-[2.5rem]
        backdrop-blur-2xl
        shadow-xl
      "
    >
      <div className="mb-6">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          CURSOS
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
          DESEMPEÑO POR CURSO
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {courses.map((course, i) => {
          const status = getStatus(course.score);

          return (
            <div
              key={i}
              className="
                bg-[#0f111a]/50
                border border-white/10
                p-5
                rounded-2xl
                hover:bg-white/[0.05]
                hover:border-white/20
                transition-all
              "
            >
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-2">
                CURSO
              </p>

              <p className="text-white font-black text-[13px] uppercase tracking-wide">
                {course.name}
              </p>

              <div className="flex items-center justify-between mt-4">

                <span className="text-yellow-400 font-black text-xl">
                  {course.score}
                </span>

                <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>
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