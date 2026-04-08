export default function ReportFilters() {
  return (
    <div className="
      bg-[#0f111a]/50
      border border-white/10
      p-5
      rounded-2xl
      backdrop-blur-2xl
      shadow-xl
      mb-6
    ">

      <p className="mb-4 font-semibold text-gray-200 tracking-tight">
        Filtrar Reportes
      </p>

      <div className="flex gap-3 flex-wrap">

        {/* ACTIVO */}
        <button className="
          bg-yellow-400/90
          text-black
          px-4 py-2
          rounded-xl
          text-sm font-semibold
          shadow-sm
          hover:bg-yellow-300
          active:scale-95
          transition-all
        ">
          Reporte General
        </button>

        {/* INACTIVOS */}
        <button className="
          bg-white/5
          border border-white/10
          px-4 py-2
          rounded-xl
          text-sm
          text-gray-300
          hover:bg-white/10
          hover:text-white
          transition-all
        ">
          Por Docente
        </button>

        <button className="
          bg-white/5
          border border-white/10
          px-4 py-2
          rounded-xl
          text-sm
          text-gray-300
          hover:bg-white/10
          hover:text-white
          transition-all
        ">
          Por Curso
        </button>

        <button className="
          bg-white/5
          border border-white/10
          px-4 py-2
          rounded-xl
          text-sm
          text-gray-300
          hover:bg-white/10
          hover:text-white
          transition-all
        ">
          Tendencias
        </button>

      </div>
    </div>
  );
}