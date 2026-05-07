import { useEffect, useState } from "react";
import { TeacherRow } from "./TeacherRow";
import { teacherService } from "../../services/teacherService";
import type { TeacherStats } from "../../types/teacher";
import { Database, ChevronLeft, ChevronRight, Loader2, SearchX } from "lucide-react";

export const TeachersTable = ({ filter, facultyId }: { filter: string; facultyId: number }) => {
  const [teachers, setTeachers] = useState<TeacherStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const data = await teacherService.getTeachersStats(facultyId, currentPage);
      
        setTeachers(data.teachers_paginated || []);
        setTotalCount(data.count || 0);
      } catch (error) {
        console.error("Error al cargar docentes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (facultyId) fetchTeachers();
  }, [facultyId, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [facultyId, filter]);

  const getStatus = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 65) return "Bueno";
    return "Bajo";
  };

  const displayedTeachers = filter === "Todos"
    ? teachers
    : teachers.filter((t) => getStatus(t.promedio_general) === filter);

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && currentPage === 1 && teachers.length === 0) return (
    <div className="py-20 flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Cargando Docentes...</p>
    </div>
  );

  return (
    <div className="w-full overflow-hidden rounded-[3rem] border border-white/10 bg-[#0f111a]/50 backdrop-blur-2xl shadow-2xl">
      <div className="px-10 pt-10 pb-5 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
            LISTADO DE DOCENTES
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-4 ml-1">
            EVALUACIÓN · RENDIMIENTO ACADÉMICO
          </p>
        </div>
        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
          {totalCount} Docentes Totales
        </div>
      </div>

      <div className="overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-[#0f111a]/20 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-yellow-400" size={32} />
          </div>
        )}

        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead className="bg-white/[0.02] text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] border-b border-white/5">
            <tr>
              <th className="px-10 py-6">Docente</th>
              <th className="px-6 py-6 w-[400px]">Cursos</th>
              <th className="px-6 py-6">Promedio</th>
              <th className="px-6 py-6">Tendencia</th>
              <th className="px-6 py-6">Evaluaciones</th>
              <th className="px-6 py-6">Recomendacion</th>
              <th className="px-6 py-6">Estado</th>
              <th className="px-10 py-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayedTeachers.length > 0 ? (
              displayedTeachers.map((t) => (
                <tr key={t.teacher_id} className="group hover:bg-white/[0.03] transition-all duration-300">
                  <TeacherRow teacher={t} />
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-32">
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-full mb-6">
                      {teachers.length === 0 ? (
                        <Database size={32} className="text-gray-700 opacity-20" />
                      ) : (
                        <SearchX size={32} className="text-gray-700" />
                      )}
                    </div>
                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">
                      {teachers.length === 0 ? "Base de datos vacía" : "Sin coincidencias"}
                    </p>
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-2">
                      {teachers.length === 0 
                        ? "No se encontraron registros de docentes para esta facultad" 
                        : `No hay docentes con el estado "${filter}" en esta página`}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="px-10 py-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Página {currentPage} de {totalPages || 1}
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};