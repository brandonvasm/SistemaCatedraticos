import TeacherCardDetail from "./TeacherCardDetail";
export default function TeachersList() {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">

      <h2 className="mb-4">Docentes Asignados</h2>

      <div className="space-y-4">

        <TeacherCardDetail />
        <TeacherCardDetail />

      </div>
    </div>
  );
}