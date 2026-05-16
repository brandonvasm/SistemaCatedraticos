export default function Charts() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">

      <div className="
        bg-white/5
        border border-white/10
        p-6
        rounded-2xl
        backdrop-blur-xl
      ">
        <h2 className="mb-4 text-gray-200 font-semibold">
          Evolución Histórica
        </h2>

        <div className="h-40 flex items-end gap-4">

          {[60, 70, 80, 90].map((h, i) => (
            <div
              key={i}
              className="
                w-4
                bg-blue-400
                rounded-t-md
                hover:bg-blue-300
                transition
              "
              style={{ height: `${h}%` }}
            />
          ))}

        </div>
      </div>

      <div className="
        bg-white/5
        border border-white/10
        p-6
        rounded-2xl
        backdrop-blur-xl
      ">
        <h2 className="mb-4 text-gray-200 font-semibold">
          Evaluación por Categoría
        </h2>

        <div className="h-40 flex justify-center items-center">

          <div className="
            relative
            w-32 h-32
            rounded-full
            border-4 border-blue-400/30
          ">

            <div className="
              absolute inset-0
              rounded-full
              border-4 border-blue-400
              border-t-transparent
              rotate-45
            " />

            <div className="
              absolute inset-0
              flex items-center justify-center
              text-blue-400 font-bold
            ">
              85%
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}