import { useEffect, useState } from "react";
import { TeacherRow } from "./TeacherRow";
import { teacherService } from "../../services/teacherService";
import type { TeacherStats } from "../../types/teacher";
import { RefreshCcw, Database } from "lucide-react";

export const TeachersTable = ({ filter, facultyId }: { filter: string; facultyId: number }) => {
  const [teachers, setTeachers] = useState<TeacherStats[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatus = (score: number) => {
    if (score >= 4.5) return "Excelente";
    if (score >= 4.0) return "Bueno";
    return "Bajo";
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const data = await teacherService.getTeachersStats(facultyId);
        setTeachers(data);
      } catch (error) {
        console.error("Error al cargar docentes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (facultyId) fetchTeachers();
  }, [facultyId]);

  const filteredTeachers = filter === "Todos"
    ? teachers
    : teachers.filter((t) => getStatus(t.promedio_general) === filter);

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center text-yellow-400 bg-[#0f111a]/50 backdrop-blur-2xl rounded-[3rem] border border-white/10">
      <RefreshCcw size={48} className="animate-spin mb-6 opacity-80" />
      <p className="text-[11px] font-black uppercase tracking-[0.5em] animate-pulse">
        Sincronizando con Facultad...
      </p>
    </div>
  );

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
      <div className="px-10 pt-10 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
          LISTADO DE DOCENTES
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-4 ml-1">
          EVALUACIÓN · RENDIMIENTO ACADÉMICO
        </p>
      </div>

      <div className="overflow-x-auto">
        {teachers.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-600">
            <Database size={40} className="mb-4 opacity-10" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sin registros académicos encontrados</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[1000px]">
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
                <th className="px-10 py-6">Docente</th>
                <th className="px-6 py-6">Cursos</th>
                <th className="px-6 py-6">Promedio</th>
                <th className="px-6 py-6">Tendencia</th>
                <th className="px-6 py-6">Evaluaciones</th>
                <th className="px-6 py-6">Recomendacion</th>
                <th className="px-6 py-6">Estado</th>
                <th className="px-10 py-6 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredTeachers.map((t) => (
                <tr
                  key={t.teacher_id}
                  className="group hover:bg-white/[0.03] transition-all duration-300"
                >
                  <TeacherRow teacher={t} />
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};