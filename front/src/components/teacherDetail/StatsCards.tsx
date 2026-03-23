export default function StatsCards({ teacher }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

      <div className="bg-slate-700 p-4 rounded-xl">
        <p className="text-gray-400 text-sm">Recomendación</p>
        <p className="text-green-400 text-xl font-bold">96%</p>
      </div>

      <div className="bg-slate-700 p-4 rounded-xl">
        <p className="text-gray-400 text-sm">Estudiantes</p>
        <p className="font-bold">{teacher.students}</p>
      </div>

      <div className="bg-slate-700 p-4 rounded-xl">
        <p className="text-gray-400 text-sm">Cursos</p>
        <p className="font-bold">{teacher.courses}</p>
      </div>

      <div className="bg-slate-700 p-4 rounded-xl">
        <p className="text-gray-400 text-sm">Tendencia</p>
        <p className="text-green-400 font-bold">↑ Mejorando</p>
      </div>

    </div>
  );
}