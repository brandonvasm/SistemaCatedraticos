import { FileText } from "lucide-react";

export default function ReportCard() {
  return (
    <div className="bg-[#0f111a]/50 border border-white/10 p-6 rounded-2xl backdrop-blur-2xl shadow-xl w-full md:w-[350px]">

      <div className="bg-purple-500/10 border border-purple-500/20 w-fit p-3 rounded-xl mb-4">
        <FileText className="text-purple-400" size={22} />
      </div>

      <h2 className="font-bold text-white mb-2 tracking-tight">
        Generar Reportes Globales
      </h2>

      <p className="text-sm text-gray-500 mb-5">
        Crear reportes ejecutivos para junta directiva
      </p>

      <div className="flex justify-between items-center">

        <span className="text-yellow-400 text-2xl font-bold tracking-tight">
          1
        </span>

        <button className="
          bg-yellow-400/90
          text-black
          px-4 py-2
          rounded-lg
          text-sm font-semibold
          hover:bg-yellow-300
          active:scale-95
          transition-all
        ">
          Generar reporte
        </button>

      </div>
    </div>
  );
}