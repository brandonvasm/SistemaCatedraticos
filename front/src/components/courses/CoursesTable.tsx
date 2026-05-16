import CourseRow from "./CourseRow";
import { useEffect, useState } from "react";
import { courseService } from "../../services/courseService";
import type { CourseTable } from "../../types/courseTable";
import { ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown, Info, Sigma } from "lucide-react";

const FormulaTooltip = ({ title, formula, description }: { title: string, formula: string, description: string }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 p-5 bg-[#0f111a] border border-white/10 rounded-3xl opacity-0 group-hover/tip:opacity-100 transition-all duration-300 pointer-events-none z-[100] shadow-[0_10px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/5 text-center">
    <div className="relative flex items-center justify-between mb-2 pb-2 border-b border-white/5">
      <p className="text-[10px] font-black text-yellow-400 uppercase tracking-tighter">{title}</p>
      <Sigma size={10} className="text-gray-600" />
    </div>
    <div className="relative bg-black/40 rounded-lg p-3 mb-3 border border-white/5">
      <code className="text-emerald-400 font-mono text-[9px] block leading-relaxed ">
        {formula}
      </code>
    </div>
    <p className="text-[9px] text-gray-400 leading-tight tracking-normal font-medium">
      {description}
    </p>
    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0f111a] border-l border-t border-white/10 rotate-45" />
  </div>
);

export default function CoursesTable() {
  const [search, setSearch] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("Todos");
  const [order, setOrder] = useState("desc");
  const [courses, setCourses] = useState<CourseTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourses(currentPage, pageSize);
        
        const mapped = response.results.map((c: any) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          credits: c.credits,
          score: c.score, 
          trend: c.trend,
          is_active: c.is_active,
          careers: c.careers || [], 
          category: c.code.startsWith("SIS") ? "Informática" : "General" 
        }));

        setCourses(mapped);
        setTotalCount(response.count);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage]);

  const uniqueCareers = Array.from(
    new Set(courses.flatMap(c => c.careers.map(car => car.name)))
  ).sort();

  const filtered = courses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchCareer = selectedCareer === "Todos" || c.careers.some(car => car.name === selectedCareer);
    return matchSearch && matchCareer;
  });

  const sorted = [...filtered].sort((a, b) =>
    order === "asc" ? (a.score ?? 0) - (b.score ?? 0) : (b.score ?? 0) - (a.score ?? 0)
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="w-full bg-[#0f111a]/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl text-white">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tighter uppercase leading-none">
            GESTIÓN DE CURSOS
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
            EVALUACIÓN · RENDIMIENTO ACADÉMICO
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group/status cursor-help p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl backdrop-blur-md">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></span>
            </div>
            
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-[#1a1d29] border border-white/10 rounded-lg opacity-0 group-hover/status:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                Cursos activos en semestre
              </p>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1d29] border-r border-b border-white/10 rotate-45" />
            </div>
          </div>

          <div className="px-5 py-2.5 bg-white/[0.03] rounded-xl border border-white/5 backdrop-blur-md">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              CURSOS TOTALES: <span className="text-yellow-400 ml-2 text-xs">{totalCount}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
          <input
            type="text"
            placeholder="BUSCAR POR NOMBRE O CÓDIGO..."
            className="w-full border-none py-4 pl-12 pr-6 rounded-2xl text-[10px] font-bold text-white outline-none placeholder:text-gray-600 tracking-widest uppercase bg-white/[0.03] focus:bg-white/[0.05] transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
          <select
            className="appearance-none bg-white/5 border border-white/10 pl-12 pr-10 py-4 rounded-2xl text-gray-400 outline-none cursor-pointer hover:border-white/20 transition-all font-bold text-[10px] uppercase tracking-widest min-w-[200px]"
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
          >
            <option value="Todos" className="bg-[#0b101f]">Todas las Carreras</option>
            {uniqueCareers.map(name => (
              <option key={name} value={name} className="bg-[#0b101f]">{name}</option>
            ))}
          </select>
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
          <thead className="bg-white/[0.02] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5 relative z-20">
            <tr>
              <th className="px-6 py-5 w-[280px] text-left">Curso</th>
              <th className="px-6 py-5 w-[220px] text-center font-black">Carrera(s)</th>
              <th className="px-6 py-5 w-[140px] text-center">Código</th>
              <th className="px-6 py-5 w-[100px] text-center">Créditos</th>
              
              <th className="px-6 py-5 w-[120px] text-center relative group/tip">
                <div className="flex items-center justify-center gap-1 cursor-help">
                  <span className="border-b border-dotted border-gray-700 group-hover/tip:border-yellow-400 transition-colors">Promedio</span>
                  <Info size={10} className="text-gray-700" />
                </div>
                <FormulaTooltip 
                  title="Promedio del Curso"
                  formula="Sum(control_score) / Total_Secciones"
                  description="Media aritmética basada en el rendimiento de todas las secciones activas del curso."
                />
              </th>

              <th className="px-6 py-5 w-[120px] text-center relative group/tip">
                <div className="flex items-center justify-center gap-1 cursor-help">
                  <span className="border-b border-dotted border-gray-700 group-hover/tip:border-yellow-400 transition-colors">Tendencia</span>
                  <Info size={10} className="text-gray-700" />
                </div>
                <FormulaTooltip 
                  title="Tendencia de Rendimiento"
                  formula="((Hist_Act - Hist_Ant) / Hist_Ant) * 100"
                  description="Variación porcentual del promedio histórico actual frente al semestre anterior."
                />
              </th>

              <th className="px-6 py-5 w-[140px] text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {!loading && sorted.map((c) => (
              <tr key={c.id} className="group hover:bg-white/[0.03] transition-all duration-300 whitespace-nowrap">
                <CourseRow course={c} />
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Sincronizando cursos...</p>
          </div>
        )}

        {!loading && sorted.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Sin cursos encontrados</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center border-t border-white/5 pt-8 gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} strokeWidth={3} />
            Anterior
          </button>
          
          <div className="flex items-center gap-2">
             {[...Array(totalPages)].map((_, i) => {
               const pageNum = i + 1;
               if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                 return (
                   <button
                     key={pageNum}
                     onClick={() => setCurrentPage(pageNum)}
                     className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                       currentPage === pageNum 
                       ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)]" 
                       : "bg-white/5 text-gray-500 hover:bg-white/10"
                     }`}
                   >
                     {pageNum}
                   </button>
                 );
               } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                 return <span key={pageNum} className="text-gray-700 mx-1">...</span>;
               }
               return null;
             })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            Siguiente
            <ChevronRight size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}