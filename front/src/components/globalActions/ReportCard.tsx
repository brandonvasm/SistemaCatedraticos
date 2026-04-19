import { FileText } from "lucide-react";

export default function ReportCard() {
  return (
    <div className="bg-secondary/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-xl w-full md:w-[380px] relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-400/10 blur-[80px] rounded-full -ml-20 -mt-20 opacity-20 pointer-events-none" />

      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-yellow-400/10 text-yellow-400">
        <FileText size={20} />
      </div>

      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
        Generar Reportes Globales
      </p>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold text-yellow-400 tracking-tighter">
          1
        </span>
        <span className="text-gray-500 text-[10px] leading-tight font-medium">
          Crear reportes ejecutivos para junta directiva
        </span>
      </div>

      <button className="px-5 py-2.5 bg-yellow-400 text-black rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20">
        Generar reporte
      </button>
    </div>
  );
}