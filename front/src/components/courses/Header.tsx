import { Download } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">

      <div className="w-full md:w-auto">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
          GESTIÓN DE CURSOS
        </h1>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
          ANÁLISIS · MATERIAS · SECCIONES
        </p>
      </div>

      <button className="
        bg-yellow-400 hover:bg-yellow-500
        text-black
        font-black
        px-8 py-4
        rounded-2xl
        flex items-center gap-3
        transition-all
        active:scale-95
        shadow-xl shadow-yellow-400/10
        text-[11px]
        uppercase
        tracking-widest
        shrink-0
      ">
        <Download size={18} />
        <span>Exportar</span>
      </button>

    </div>
  );
}