export default function ReportFilters() {
  return (
    <div
      className="
        relative
        bg-[#0f111a]/50
        border border-white/10
        p-6
        rounded-[1.8rem]
        backdrop-blur-2xl
        shadow-xl
        mb-10
        overflow-hidden
      "
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-4 mb-5">
        <div className="h-px w-10 bg-yellow-400/30" />
        <p className="text-sm font-black text-white uppercase tracking-tighter">
          Filtrar Reportes
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">

        <button
          className="
            bg-yellow-400
            text-black
            px-5 py-2.5
            rounded-xl
            text-[11px]
            font-black
            uppercase
            tracking-wide
            shadow-lg shadow-yellow-400/20
            hover:bg-yellow-300
            hover:scale-[1.03]
            active:scale-95
            transition-all
          "
        >
          Reporte General
        </button>

        <button
          className="
            bg-white/[0.03]
            border border-white/10
            px-5 py-2.5
            rounded-xl
            text-[11px]
            text-gray-300
            uppercase
            tracking-wide
            hover:bg-white/[0.06]
            hover:text-white
            hover:border-white/20
            transition-all
          "
        >
          Por Docente
        </button>

        <button
          className="
            bg-white/[0.03]
            border border-white/10
            px-5 py-2.5
            rounded-xl
            text-[11px]
            text-gray-300
            uppercase
            tracking-wide
            hover:bg-white/[0.06]
            hover:text-white
            hover:border-white/20
            transition-all
          "
        >
          Por Curso
        </button>

        <button
          className="
            bg-white/[0.03]
            border border-white/10
            px-5 py-2.5
            rounded-xl
            text-[11px]
            text-gray-300
            uppercase
            tracking-wide
            hover:bg-white/[0.06]
            hover:text-white
            hover:border-white/20
            transition-all
          "
        >
          Tendencias
        </button>

      </div>
    </div>
  );
}