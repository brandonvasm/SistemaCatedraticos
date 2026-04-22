import TeacherCardDetail from "./TeacherCardDetail";

export default function TeachersList() {
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
      "
    >
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400/[0.03] blur-[80px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="mb-5 relative z-10">
        <h2 className="text-sm font-black text-white tracking-tight uppercase">
          Docentes Asignados
        </h2>

        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Profesores vinculados al curso
        </p>
      </div>

      <div className="space-y-4 relative z-10">
        <TeacherCardDetail />
        <TeacherCardDetail />
      </div>
    </div>
  );
}