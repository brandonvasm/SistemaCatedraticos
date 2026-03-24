export default function StatsCards({ teacher }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

      <div className="
        bg-white/5
        border border-white/10
        p-4 rounded-2xl
        backdrop-blur-xl
        hover:bg-white/10
        transition
      ">
        <p className="text-gray-400 text-sm">Recomendación</p>
        <p className="text-emerald-400 text-xl font-bold">96%</p>
      </div>

      <div className="
        bg-white/5
        border border-white/10
        p-4 rounded-2xl
        backdrop-blur-xl
        hover:bg-white/10
        transition
      ">
        <p className="text-gray-400 text-sm">Estudiantes</p>
        <p className="text-gray-200 text-xl font-bold">
          {teacher.students}
        </p>
      </div>

      <div className="
        bg-white/5
        border border-white/10
        p-4 rounded-2xl
        backdrop-blur-xl
        hover:bg-white/10
        transition
      ">
        <p className="text-gray-400 text-sm">Cursos</p>
        <p className="text-blue-400 text-xl font-bold">
          {teacher.courses}
        </p>
      </div>

      <div className="
        bg-white/5
        border border-white/10
        p-4 rounded-2xl
        backdrop-blur-xl
        hover:bg-white/10
        transition
      ">
        <p className="text-gray-400 text-sm">Tendencia</p>
        <p className="text-emerald-400 font-bold">
          ↑ Mejorando
        </p>
      </div>

    </div>
  );
}