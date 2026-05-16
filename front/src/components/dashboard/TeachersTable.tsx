import { useEffect, useState } from "react";
import { TeacherRow } from "./TeacherRow";
import { teacherService } from "../../services/teacherService";
import type { TeacherStats } from "../../types/teacher";
import { ChevronLeft, ChevronRight, Loader2, SearchX, Search, ArrowUpDown, Sigma, Info } from "lucide-react";

const FormulaTooltip = ({ title, formula, description }: { title: string, formula: string, description: string }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 p-5 bg-[#0f111a] border border-white/10 rounded-3xl opacity-0 group-hover/tip:opacity-100 transition-all duration-300 pointer-events-none z-[100] shadow-[0_10px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
    
    <div className="relative flex items-center justify-between mb-2 pb-2 border-b border-white/5">
      <p className="text-[10px] font-black text-yellow-400 uppercase tracking-tighter">{title}</p>
      <Sigma size={10} className="text-gray-600" />
    </div>

    <div className="relative bg-black/40 rounded-lg p-3 mb-3 border border-white/5 flex items-center justify-center">
      <code className="text-emerald-400 font-mono text-[9px] block text-center leading-relaxed">
        {formula}
      </code>
    </div>

    <p className="text-[9px] text-gray-400 leading-tight">
      {description}
    </p>

    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0f111a] border-l border-t border-white/10 rotate-45" />
  </div>
);

export const TeachersTable = ({ filter, facultyId }: { filter: string; facultyId: number }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState<TeacherStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState("desc");
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
  }, [facultyId, filter, searchTerm]);

  const getStatus = (score: number) => {
    if (score >= 65) return "Excelente (>= 65)";
    return "Bajo";
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchStatus = filter === "Todos" || getStatus(t.promedio_general) === filter;
    const matchSearch = t.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const sortedTeachers = [...filteredTeachers].sort((a, b) =>
    order === "asc" 
      ? (a.promedio_general ?? 0) - (b.promedio_general ?? 0) 
      : (b.promedio_general ?? 0) - (a.promedio_general ?? 0)
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="w-full bg-[#0f111a]/80 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl text-white">
      
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tighter uppercase leading-none">
            LISTADO DE DOCENTES
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
            REGISTROS · RENDIMIENTO ACADÉMICO
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group/status cursor-help p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-[#1a1d29] border border-white/10 rounded-lg opacity-0 group-hover/status:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Docentes activos en semestre</p>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1d29] border-r border-b border-white/10 rotate-45" />
            </div>
          </div>

          <div className="px-5 py-2.5 bg-white/[0.03] rounded-xl border border-white/5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              DOCENTES TOTALES: <span className="text-yellow-400 ml-2 text-xs">{totalCount}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
          <input
            type="text"
            placeholder="BUSCAR DOCENTE..."
            className="w-full bg-white/[0.01] border border-white/5 py-4 pl-12 pr-6 rounded-2xl text-[10px] font-bold text-white outline-none placeholder:text-gray-600 tracking-widest uppercase focus:bg-white/[0.03] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative ml-auto">
          <ArrowUpDown className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
          <select
            className="appearance-none bg-white/5 border border-white/10 pl-12 pr-10 py-4 rounded-2xl text-gray-400 outline-none cursor-pointer hover:border-white/20 transition-all font-bold text-[10px] uppercase tracking-widest min-w-[200px]"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="desc" className="bg-[#0b101f]">Mayor Promedio</option>
            <option value="asc" className="bg-[#0b101f]">Menor Promedio</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-[1250px] w-full border-collapse">
          <thead className="bg-white/[0.01] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5 relative z-20">
            <tr>
              <th className="px-6 py-5 text-left">Docente</th>
              <th className="px-6 py-5 w-[400px] text-center">Cursos</th>
              
              <th className="px-6 py-5 text-center relative group/tip">
                <div className="flex items-center justify-center gap-1 cursor-help">
                  <span className="border-b border-dotted border-gray-700 group-hover/tip:border-yellow-400 transition-colors">
                    Promedio
                  </span>
                  <Info size={10} className="text-gray-700" />
                </div>
                <FormulaTooltip 
                  title="Promedio General"
                  formula="Media(puntuacion_actual)"
                  description="Promedio de los puntajes obtenidos en el semestre activo."
                />
              </th>

              <th className="px-6 py-5 text-center relative group/tip">
                <div className="flex items-center justify-center gap-1 cursor-help">
                  <span className="border-b border-dotted border-gray-700 group-hover/tip:border-yellow-400 transition-colors">
                    Tendencia
                  </span>
                  <Info size={10} className="text-gray-700" />
                </div>
                <FormulaTooltip 
                  title="Tendencia de Mejora"
                  formula="((S_act - S_ant) / S_ant) * 100"
                  description="Progreso porcentual frente al semestre anterior del docente."
                />
              </th>

              <th className="px-6 py-5 text-center">Evaluaciones</th>
              <th className="px-6 py-5 text-center relative group/tip">
                <div className="flex items-center justify-center gap-1 cursor-help">
                  <span className="border-b border-dotted border-gray-700 group-hover/tip:border-yellow-400 transition-colors">
                    Recomendacion
                  </span>
                  <Info size={10} className="text-gray-700" />
                </div>
                <FormulaTooltip 
                  title="Recomendado vs Otros"
                  formula="((P_docente - P_facultad) / P_facultad) * 100"
                  description="Comparativa porcentual contra el promedio de la facultad."
                />
              </th>

              <th className="px-6 py-5 text-center">Estado</th>
              <th className="px-6 py-5 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {!loading && sortedTeachers.map((t) => (
              <tr key={t.teacher_id} className="group hover:bg-white/[0.01] transition-all duration-300 whitespace-nowrap">
                <TeacherRow teacher={t} />
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-yellow-400" size={32} />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Sincronizando docentes...</p>
          </div>
        )}

        {!loading && sortedTeachers.length === 0 && (
          <div className="py-20 text-center">
             <div className="flex flex-col items-center justify-center">
                <SearchX size={32} className="text-gray-700 mb-4" />
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Sin docentes encontrados</p>
             </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center border-t border-white/5 pt-8 gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} strokeWidth={3} /> Anterioe
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-yellow-400 text-black shadow-lg" : "bg-white/5 text-gray-500 hover:bg-white/10"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            Siguiente <ChevronRight size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};