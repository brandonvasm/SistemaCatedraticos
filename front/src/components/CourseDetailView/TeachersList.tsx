import { useEffect, useState } from "react";
import TeacherCardDetail from "./TeacherCardDetail";
import { courseService } from "../../services/courseService";

export default function TeachersList({ courseId }: { courseId?: string }) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const data = await courseService.getCourseTeachersStats(courseId);
        setTeachers(data);
      } catch (error) {
        console.error("Error al cargar lista de docentes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [courseId]);

  return (
    <div
      className="
        relative
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[2rem]
        backdrop-blur-2xl
        shadow-xl
        overflow-hidden
        h-full
      "
    >
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400/[0.03] blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="mb-5 relative z-10">
        <h2 className="text-sm font-black text-white tracking-tight uppercase">
          Docentes Asignados
        </h2>

        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          {loading ? "Sincronizando con el servidor..." : "Docentes vinculados al curso"}
        </p>
      </div>

      <div className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {teachers.length > 0 ? (
          teachers.map((t) => (
            <TeacherCardDetail 
              key={t.teacher_id} 
              teacher={t} 
            />
          ))
        ) : !loading && (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
            <p className="text-[10px] text-white font-black uppercase tracking-widest">
              No se encontraron docentes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}