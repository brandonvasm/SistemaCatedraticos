import { Settings2 } from "lucide-react";

export default function CustomReport() {
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
        flex flex-col md:flex-row
        justify-between
        md:items-center
        gap-6
        mb-10
        hover:border-yellow-400/30
        hover:bg-white/[0.05]
        transition-all duration-300
        overflow-hidden
      "
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/[0.04] blur-[90px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex items-start gap-4 relative z-10">
        <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 shadow-lg shadow-yellow-400/10">
          <Settings2 className="text-yellow-400" size={20} />
        </div>

        <div>
          <h2 className="font-black text-white tracking-tight uppercase text-[11px]">
            Generar Reporte Personalizado
          </h2>

          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
            Configura parámetros específicos para tu análisis
          </p>
        </div>
      </div>

      <button
        className="
          relative z-10
          bg-yellow-400
          text-black
          px-6 py-3
          rounded-xl
          text-[11px] font-black
          uppercase
          tracking-widest
          shadow-lg shadow-yellow-400/20
          hover:bg-yellow-300
          hover:scale-[1.05]
          active:scale-95
          transition-all
        "
      >
        Configurar Reporte
      </button>
    </div>
  );
}