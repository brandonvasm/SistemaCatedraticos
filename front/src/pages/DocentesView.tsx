import { useState } from "react";
import { Filters } from "../components/dashboard/Filters";
import { TeachersTable } from "../components/dashboard/TeachersTable";
import { Download } from "lucide-react";

export default function DocentesViews() {
  const [activeFilter, setActiveFilter] = useState("Todos");

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="w-full md:w-auto">
          
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            GESTIÓN DE DOCENTES
          </h1>

          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
            EVALUACIÓN · RENDIMIENTO · SEGUIMIENTO ACADÉMICO
          </p>
        </div>

        <button 
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 py-4 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-yellow-400/10 text-[11px] uppercase tracking-widest shrink-0"
        >
          <Download size={18} />
          <span>Exportar</span>
        </button>
      </header>

      <Filters active={activeFilter} setActive={setActiveFilter} />

      <div className="glass-card overflow-hidden relative border-white/5 bg-white/[0.01]">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        
        <TeachersTable filter={activeFilter} />
      </div>

    </div>
  );
}