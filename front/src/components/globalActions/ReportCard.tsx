import { FileText } from "lucide-react";

export default function ReportCard() {
  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[2rem]
        backdrop-blur-2xl
        shadow-xl
        w-full md:w-[350px]
        hover:border-yellow-400/30
        hover:bg-white/[0.05]
        transition-all duration-300
        overflow-hidden
      "
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/[0.03] blur-[80px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div
        className="
          bg-yellow-400/10
          border border-yellow-400/20
          w-fit
          p-3
          rounded-2xl
          mb-5
          text-yellow-400
          shadow-inner
        "
      >
        <FileText size={22} />
      </div>

      <h2
        className="
          text-[11px]
          font-black
          text-white
          tracking-tight
          uppercase
        "
      >
        Generar Reportes Globales
      </h2>

      <p
        className="
          text-[10px]
          text-gray-500
          uppercase
          tracking-widest
          mt-2
          mb-6
        "
      >
        Crear reportes ejecutivos para junta directiva
      </p>

      <div className="flex justify-between items-center">
        <span
          className="
            text-yellow-400
            text-3xl
            font-black
            tracking-tighter
          "
        >
          1
        </span>

        <button
          className="
            px-5 py-2.5
            bg-yellow-400
            text-black
            rounded-xl
            text-[11px]
            font-black
            tracking-widest
            uppercase
            hover:bg-yellow-300
            hover:scale-[1.05]
            active:scale-95
            transition-all
            shadow-lg shadow-yellow-400/20
          "
        >
          Generar reporte
        </button>
      </div>
    </div>
  );
}