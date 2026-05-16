export default function Tags() {

  const courses = [
    "Cálculo I",
    "Cálculo II",
    "Álgebra Lineal",
    "Estadística",
  ];

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
          Cursos que puede impartir
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Especialidades docentes
        </p>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2">

        {courses.map((c) => (
          <span
            key={c}
            className="
              px-3 py-1.5
              rounded-xl
              text-xs md:text-sm
              font-medium
              tracking-wide

              bg-blue-500/10
              text-blue-400
              border border-blue-500/20

              hover:bg-blue-500/20
              hover:border-blue-500/40

              transition-all duration-200
            "
          >
            {c}
          </span>
        ))}

      </div>
    </div>
  );
}