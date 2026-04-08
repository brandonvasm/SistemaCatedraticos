export default function Header({ teacher }: any) {
  return (
    <div
      className="
        p-5 md:p-6
        rounded-2xl
        backdrop-blur-2xl
        shadow-xl
      "
    >
      <div className="flex flex-col md:flex-row justify-between gap-6">

        {/* INFO DOCENTE */}
        <div className="flex items-center gap-4">

          {/* AVATAR */}
          <div
            className="
              w-14 h-14
              rounded-2xl
              flex items-center justify-center
              font-bold text-sm
              bg-gradient-to-br from-yellow-400/20 to-yellow-600/5
              text-yellow-400
              border border-yellow-400/20
            "
          >
            {teacher.name
              .split(" ")
              .slice(0, 2)
              .map((n: string) => n[0])
              .join("")}
          </div>

          {/* TEXT */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {teacher.name}
            </h1>

            <p className="text-gray-400 text-sm">
              Matemáticas Aplicadas
            </p>
          </div>
        </div>

        {/* SCORE */}
        <div className="text-right">
          <p className="text-3xl font-bold text-yellow-400">
            {teacher.score}
          </p>

          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            245 evaluaciones
          </p>
        </div>

      </div>
    </div>
  );
}