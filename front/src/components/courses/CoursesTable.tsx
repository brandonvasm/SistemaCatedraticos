import CourseRow from "./CourseRow";
import { useEffect, useState } from "react";
import { courseService } from "../../services/courseService";
import type { CourseTable } from "../../types/courseTable";
import { Download } from "lucide-react";

export default function CoursesTable() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [order, setOrder] = useState("desc");

  const [courses, setCourses] = useState<CourseTable[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses();
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  const descargarReporte = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8000/api/reports/cursos-reports/?faculty=7"
      );

      if (!response.ok) {
        throw new Error("Error al descargar");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_cursos.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "Todos" || c.category === category;

    return matchSearch && matchCategory;
  });

  const sorted = [...filtered].sort((a, b) =>
    order === "asc" ? a.avg - b.avg : b.avg - a.avg
  );

  return (
    <div className="w-full bg-[#0f111a]/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
            GESTIÓN DE CURSOS
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
            EVALUACIÓN · RENDIMIENTO ACADÉMICO
          </p>
        </div>

        <button
          onClick={descargarReporte}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-400/10 border-none disabled:opacity-50"
        >
          <Download size={12} />
          {loading ? "DESCARGANDO..." : "DESCARGAR REPORTE"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <input
          type="text"
          placeholder="BUSCAR CURSO..."
          className="w-full md:w-72 bg-transparent border-none py-4 px-6 rounded-2xl text-[10px] font-bold text-white outline-none placeholder:text-gray-600 tracking-widest uppercase bg-white/[0.03]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-gray-400 outline-none cursor-pointer hover:border-yellow-400/20 transition-all font-bold text-[10px] uppercase tracking-widest min-w-[180px]"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Todos" className="bg-[#0b101f] text-gray-300">Todos</option>
          <option value="Matemática" className="bg-[#0b101f] text-gray-300">Matemática</option>
          <option value="Informática" className="bg-[#0b101f] text-gray-300">Informática</option>
        </select>

        <select
          className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-gray-400 outline-none cursor-pointer hover:border-yellow-400/20 transition-all font-bold text-[10px] uppercase tracking-widest min-w-[180px]"
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="desc" className="bg-[#0b101f] text-gray-300">Mayor Promedio</option>
          <option value="asc" className="bg-[#0b101f] text-gray-300">Menor Promedio</option>
        </select>

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">

          <thead className="bg-white/[0.02] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
            <tr>
              <th className="px-6 py-5 w-[220px]">Curso</th>
              <th className="px-6 py-5 w-[90px] text-center">Código</th>
              <th className="px-6 py-5 w-[80px] text-center">Docentes</th>
              <th className="px-6 py-5 w-[120px] text-center">Promedio</th>
              <th className="px-6 py-5 w-[100px] text-center">Tendencia</th>
              <th className="px-6 py-5 w-[100px] text-center">Recomendado</th>
              <th className="px-6 py-5 w-[150px] text-center">Docente</th>
              <th className="px-6 py-5 w-[100px] text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {sorted.map((c) => (
              <tr
                key={c.id}
                className="group hover:bg-white/[0.03] transition-all duration-300"
              >
                <CourseRow course={c} />
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}