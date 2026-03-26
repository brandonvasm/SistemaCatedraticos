export default function StatsCards() {
  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">

      <div className="
        bg-white/5
        border border-white/10
        p-5
        rounded-2xl
        backdrop-blur-xl
        hover:bg-white/10
        transition
      ">
        <p className="text-gray-400 text-sm">Total Cursos</p>
        <p className="text-2xl font-bold text-gray-200">6</p>
      </div>

      <div className="
        bg-white/5
        border border-white/10
        p-5
        rounded-2xl
        backdrop-blur-xl
        hover:bg-white/10
        transition
      ">
        <p className="text-gray-400 text-sm">Promedio Global</p>
        <p className="text-yellow-400 text-2xl font-bold">4.1</p>
      </div>

      <div className="
        bg-white/5
        border border-white/10
        p-5
        rounded-2xl
        backdrop-blur-xl
        hover:bg-white/10
        transition
      ">
        <p className="text-gray-400 text-sm">Secciones</p>
        <p className="text-2xl font-bold text-gray-200">41</p>
      </div>

      <div className="
        bg-white/5
        border border-white/10
        p-5
        rounded-2xl
        backdrop-blur-xl
        hover:bg-white/10
        transition
      ">
        <p className="text-gray-400 text-sm">Estudiantes</p>
        <p className="text-2xl font-bold text-gray-200">1174</p>
      </div>

    </div>
  );
}