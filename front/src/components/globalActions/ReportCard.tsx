import { FileText } from "lucide-react";

export default function ReportCard() {
  return (
    <div className="bg-[#1c2746] p-6 rounded-xl w-full md:w-[350px]">

      <div className="bg-purple-500/20 w-fit p-3 rounded-xl mb-4">
        <FileText className="text-purple-400" />
      </div>

      <h2 className="font-semibold mb-2">
        Generar Reportes Globales
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Crear reportes ejecutivos para junta directiva
      </p>

      <div className="flex justify-between items-center">
        <span className="text-yellow-400 text-xl font-bold">
          1
        </span>

        <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm">
          Generar reporte
        </button>
      </div>
    </div>
  );
}