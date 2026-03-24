export default function CoursesList() {
  return (
    <div className="
      bg-white/5
      border border-white/10
      p-6
      rounded-2xl
      backdrop-blur-xl
      mb-6
    ">
      <h2 className="mb-4 text-gray-200 font-semibold">
        Cursos
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="
          bg-white/5
          border border-white/10
          p-4
          rounded-xl
          hover:bg-white/10
          transition
        ">
          <p className="text-xs text-gray-400 mb-1">
            Curso
          </p>

          <p className="text-gray-200 font-medium">
            Cálculo I
          </p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-yellow-400 font-bold text-lg">
              4.9
            </span>

            <span className="text-gray-400 text-xs">
              Excelente
            </span>
          </div>
        </div>

        <div className="
          bg-white/5
          border border-white/10
          p-4
          rounded-xl
          hover:bg-white/10
          transition
        ">
          <p className="text-xs text-gray-400 mb-1">
            Curso
          </p>

          <p className="text-gray-200 font-medium">
            Cálculo II
          </p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-yellow-400 font-bold text-lg">
              4.7
            </span>

            <span className="text-gray-400 text-xs">
              Muy bueno
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}