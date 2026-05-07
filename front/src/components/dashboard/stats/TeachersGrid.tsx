import TeacherCard from "./TeacherCard"
import type { TeacherStats } from "../../../types/teacher";

interface TeachersGridProps {
  teachers: TeacherStats[];
  loading?: boolean; // Nueva prop opcional
}

export default function TeachersGrid({ teachers, loading }: TeachersGridProps) {

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[280px] w-full rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pb-10">
      {teachers.length > 0 ? (
        teachers.map((teacher) => (
          <TeacherCard key={teacher.teacher_id} teacher={teacher} />
        ))
      ) : (
        <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
             <div className="w-2 h-2 bg-gray-700 rounded-full" />
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px]">
            No hay docentes registrados en esta facultad
          </p>
        </div>
      )}
    </div>
  );
}