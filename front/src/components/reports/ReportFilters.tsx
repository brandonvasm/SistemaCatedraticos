export default function ReportFilters() {
  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[1.8rem]
        backdrop-blur-2xl
        shadow-xl
        mb-10
        overflow-hidden
      "
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/[0.03] blur-[80px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-4 mb-5 relative z-10">
        <div className="h-px w-10 bg-yellow-400/30" />
        <p className="text-[11px] font-black text-white uppercase tracking-tighter">
          Filtrar Reportes
        </p>
      </div>

      <div className="flex gap-3 flex-wrap relative z-10">
        <button
          className="
            bg-yellow-400
            text-black
            px-5 py-2.5
            rounded-xl
            text-[11px]
            font-black
            uppercase
            tracking-widest
            shadow-lg shadow-yellow-400/20
            hover:bg-yellow-300
            hover:scale-[1.05]
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
            text-[10px]
            text-gray-400
            uppercase
            tracking-widest
            hover:bg-white/10
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
            text-[10px]
            text-gray-400
            uppercase
            tracking-widest
            hover:bg-white/10
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
            text-[10px]
            text-gray-400
            uppercase
            tracking-widest
            hover:bg-white/10
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