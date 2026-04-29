import { useState } from "react";
import { Filters } from "../components/dashboard/Filters";
import { TeachersTable } from "../components/dashboard/TeachersTable";
import { useAuth } from "../context/AuthContext";

export default function DocentesViews() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const { user } = useAuth();

  const facultyId = user?.faculty_id;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            GESTIÓN DE DOCENTES
          </h1>

          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
            FACULTAD DE {user?.faculty_name || 'GENERAL'} · SEGUIMIENTO ACADÉMICO
          </p>
        </div>
      </header>

      <Filters active={activeFilter} setActive={setActiveFilter} />

      <div className="glass-card overflow-hidden relative border-white/5 bg-white/[0.01]">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        {facultyId ? (
          <TeachersTable filter={activeFilter} facultyId={facultyId} />
        ) : (
          <div className="py-20 text-center text-gray-500 font-black uppercase text-[10px] tracking-[0.5em]">
            Obteniendo credenciales de facultad...
          </div>
        )}
      </div>

    </div>
  );
}