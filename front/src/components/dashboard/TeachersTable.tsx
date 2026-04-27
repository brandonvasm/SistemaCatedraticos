import { TeacherRow } from "./TeacherRow";
import { useEffect, useState } from "react";
import { teacherService } from "../../services/teacherService";
import type { TeacherTable } from "../../types/teacherTable";
import { Download } from "lucide-react";

type Props = {
  filter: string;
};

export const TeachersTable = ({ filter }: Props) => {
  const [teachers, setTeachers] = useState<TeacherTable[]>([]);
  const [loading, setLoading] = useState(false);

  const getStatus = (score: number) => {
    if (score >= 4.5) return "Excelente";
    if (score >= 4) return "Bueno";
    return "Bajo";
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teacherService.getTeachers();
        setTeachers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeachers();
  }, []);

  const descargarReporte = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8000/api/reports/docentes-historico/?faculty=7"
      );

      if (!response.ok) {
        throw new Error("Error al descargar el reporte");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_docentes.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers =
    filter === "Todos"
      ? teachers
      : teachers.filter((t) => getStatus(t.score) === filter);

  return (
    <div className="
      w-full
      overflow-hidden
      rounded-[3rem]
      border border-white/10
      bg-[#0f111a]/50
      backdrop-blur-2xl
      shadow-2xl
    ">

      <div className="px-10 pt-10 pb-5 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
            LISTADO DE DOCENTES
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-4 ml-1">
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

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">

          <thead className="
            bg-white/[0.02]
            text-gray-500
            text-[10px]
            font-black
            uppercase
            tracking-[0.4em]
            border-b border-white/5
          ">
            <tr>
              <th className="px-6 py-6 w-[220px]">Docente</th>
              <th className="px-6 py-6 w-[180px]">Cursos</th>
              <th className="px-6 py-6 w-[120px]">Promedio</th>
              <th className="px-6 py-6 w-[120px]">Tendencia</th>
              <th className="px-6 py-6 w-[100px]">Evaluaciones</th>
              <th className="px-6 py-6 w-[120px]">Recomendado</th>
              <th className="px-6 py-6 w-[140px]">Estado</th>
              <th className="px-6 py-6 w-[140px] text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredTeachers.map((t) => (
              <tr
                key={t.id}
                className="
                  group
                  hover:bg-white/[0.03]
                  transition-all
                  duration-300
                "
              >
                <TeacherRow teacher={t} />
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};