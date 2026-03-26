export default function Header({ teacher }: any) {
  return (
    <div className="
      bg-white/5
      border border-white/10
      p-4 md:p-6
      rounded-2xl
      mb-4
      backdrop-blur-xl
    ">
      <div className="flex flex-col md:flex-row justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="
                        bg-yellow-400
                        text-black
                        w-14 h-14
                        flex items-center justify-center
                        rounded-xl
                        font-bold
                        border border-yellow-500
                      ">
            CM
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-200">
              {teacher.name}
            </h1>

            <p className="text-gray-400 text-sm">
              Matemáticas Aplicadas
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl text-yellow-400 font-bold">
            {teacher.score}
          </p>

          <p className="text-xs text-gray-400">
            245 evaluaciones
          </p>
        </div>

      </div>
    </div>
  );
}