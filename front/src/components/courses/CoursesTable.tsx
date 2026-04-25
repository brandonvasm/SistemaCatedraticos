import CourseRow from "./CourseRow";
import { useEffect, useState } from "react";
import { courseService } from "../../services/courseService";
import type { CourseTable } from "../../types/courseTable";

export default function CoursesTable() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [order, setOrder] = useState("desc");
  const [courses, setCourses] = useState<CourseTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourses();
        
        const mapped = data.map((c: any) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          credits: c.credits,
          avg: c.score, 
          trend: c.trend,
          category: c.code.startsWith("SIS") ? "Informática" : "General" 
        }));

        setCourses(mapped);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);


  const filtered = courses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Todos" || c.category === category;
    
    return matchSearch && matchCategory;
  });

  const sorted = [...filtered].sort((a, b) =>
    order === "asc" ? a.avg - b.avg : b.avg - a.avg
  );

  return (
    <div className="w-full bg-[#0f111a]/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          GESTIÓN DE CURSOS
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
          EVALUACIÓN · RENDIMIENTO ACADÉMICO
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="BUSCAR CURSO..."
          className="w-full md:w-72 border-none py-4 px-6 rounded-2xl text-[10px] font-bold text-white outline-none placeholder:text-gray-600 tracking-widest uppercase bg-white/[0.03]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-gray-400 outline-none cursor-pointer hover:border-yellow-400/20 transition-all font-bold text-[10px] uppercase tracking-widest min-w-[180px]"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Todos" className="bg-[#0b101f] text-gray-300">Todas las Áreas</option>
        </select>

        <select
          className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-gray-400 outline-none cursor-pointer hover:border-yellow-400/20 transition-all font-bold text-[10px] uppercase tracking-widest min-w-[180px]"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="desc" className="bg-[#0b101f] text-gray-300">Mayor Promedio</option>
          <option value="asc" className="bg-[#0b101f] text-gray-300">Menor Promedio</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse">
          <thead className="bg-white/[0.02] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
            <tr>
              <th className="px-6 py-5 w-[300px] text-center">Curso</th>
              <th className="px-6 py-5 w-[140px] text-center">Código</th>
              <th className="px-6 py-5 w-[100px] text-center">Créditos</th>
              <th className="px-6 py-5 w-[120px] text-center">Promedio</th>
              <th className="px-6 py-5 w-[120px] text-center">Tendencia</th>
              <th className="px-6 py-5 w-[120px] text-center">Acciones</th>
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
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Sincronizando...</p>
          </div>
        )}

        {!loading && sorted.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Sin registros encontrados</p>
          </div>
        )}
      </div>
    </div>
  );
}