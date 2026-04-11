export default function Header({ teacher }: any) {
  return (
    <div
      className="
        p-6 md:p-8
        rounded-[2.5rem]
        backdrop-blur-2xl
        shadow-xl
      "
    >
      <div className="flex flex-col md:flex-row justify-between gap-6">

        <div className="flex items-center gap-5">

          <div
            className="
              w-16 h-16
              rounded-2xl
              flex items-center justify-center
              font-black text-sm
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

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">
              {teacher.name}
            </h1>

            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
              MATEMÁTICAS APLICADAS
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-4xl font-black text-yellow-400">
            {teacher.score}
          </p>

          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2">
            245 EVALUACIONES
          </p>
        </div>

      </div>
    </div>
  );
}