import { FileText } from "lucide-react";

export default function ReportCard() {
  return (
    <div className="
      bg-[#0f111a]/50
      border border-white/10
      p-6
      rounded-[2rem]
      backdrop-blur-2xl
      shadow-xl
      w-full md:w-[350px]
      hover:border-purple-500/20
      transition-all duration-300
    ">

      <div className="
        bg-purple-500/10
        border border-purple-500/20
        w-fit
        p-3
        rounded-2xl
        mb-5
      ">
        <FileText className="text-purple-400" size={22} />
      </div>

      <h2 className="
        text-sm
        font-black
        text-white
        tracking-tight
      ">
        Generar Reportes Globales
      </h2>

      <p className="
        text-[11px]
        text-gray-500
        uppercase
        tracking-[0.2em]
        mt-2
        mb-6
      ">
        Crear reportes ejecutivos para junta directiva
      </p>

      <div className="flex justify-between items-center">

        <span className="
          text-yellow-400
          text-3xl
          font-black
          tracking-tighter
        ">
          1
        </span>

        <button className="
          px-5 py-2.5
          bg-yellow-400/90
          text-black
          rounded-xl
          text-xs
          font-black
          tracking-wide
          uppercase
          hover:bg-yellow-300
          active:scale-95
          transition-all
          shadow-lg shadow-yellow-400/10
        ">
          Generar reporte
        </button>

      </div>

    </div>
  );
}