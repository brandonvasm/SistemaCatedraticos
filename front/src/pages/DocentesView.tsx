import { useState } from "react";
import { Filters } from "../components/dashboard/Filters";
import { TeachersTable } from "../components/dashboard/TeachersTable";

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
      </header>

      <Filters active={activeFilter} setActive={setActiveFilter} />

      <div className="glass-card overflow-hidden relative border-white/5 bg-white/[0.01]">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        
        <TeachersTable filter={activeFilter} />
      </div>

    </div>
  );
}