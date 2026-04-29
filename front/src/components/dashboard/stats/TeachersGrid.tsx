import TeacherCard from "./TeacherCard"
import type { TeacherStats } from "../../../types/teacher";

interface TeachersGridProps {
  teachers: TeacherStats[];
}

export default function TeachersGrid({ teachers }: TeachersGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pb-10">
      {teachers.map((teacher) => (
        <TeacherCard key={teacher.teacher_id} teacher={teacher} />
      ))}
      {teachers.length === 0 && (
        <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">
          No hay docentes registrados en esta facultad
        </div>
      )}
    </div>
  )
}