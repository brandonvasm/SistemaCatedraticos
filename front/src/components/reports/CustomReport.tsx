import { Settings2 } from "lucide-react";

export default function CustomReport() {
  return (
    <div
      className="
        relative
        bg-[#0f111a]/50
        border border-yellow-500/20
        p-6
        rounded-[1.8rem]
        backdrop-blur-2xl
        shadow-xl
        flex flex-col md:flex-row
        justify-between
        md:items-center
        gap-6
        mb-10
        hover:border-yellow-400/40
        hover:bg-[#0f111a]/70
        transition-all
        overflow-hidden
      "
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-yellow-400/5 to-transparent pointer-events-none" />

      <div className="flex items-start gap-4">

        <div className="
          p-3
          rounded-2xl
          bg-yellow-400/10
          border border-yellow-400/20
          shadow-lg shadow-yellow-400/10
        ">
          <Settings2 className="text-yellow-400" size={20} />
        </div>

        <div>
          <h2 className="
            font-black
            text-white
            tracking-tight
            uppercase
            text-sm
          ">
            Generar Reporte Personalizado
          </h2>

          <p className="
            text-[11px]
            text-gray-500
            uppercase
            tracking-wider
            mt-1
          ">
            Configura parámetros específicos para tu análisis
          </p>
        </div>

      </div>

      <button
        className="
          bg-yellow-400
          text-black
          px-6 py-3
          rounded-xl
          text-xs font-black
          uppercase
          tracking-wide
          shadow-lg shadow-yellow-400/20
          hover:bg-yellow-300
          hover:scale-[1.03]
          active:scale-95
          transition-all
        "
      >
        Configurar Reporte
      </button>
    </div>
  );
}