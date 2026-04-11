import TeacherCardDetail from "./TeacherCardDetail";
export default function TeachersList() {
  return (
    <div className="
      bg-[#0f111a]/50
      border border-white/10
      p-6
      rounded-[2rem]
      backdrop-blur-2xl
      shadow-xl
    ">

      <div className="mb-5">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Docentes Asignados
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Profesores vinculados al curso
        </p>
      </div>

      <div className="space-y-4">
        <TeacherCardDetail />
        <TeacherCardDetail />
      </div>
    </div>
  );
}