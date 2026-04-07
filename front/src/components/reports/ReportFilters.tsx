export default function ReportFilters() {
  return (
    <div className="bg-[#1c2746] p-5 rounded-xl mb-6">

      <p className="mb-4 font-medium">Filtrar Reportes</p>

      <div className="flex gap-3 flex-wrap">

        <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
          Reporte General
        </button>

        <button className="bg-slate-700 px-4 py-2 rounded-lg">
          Por Docente
        </button>

        <button className="bg-slate-700 px-4 py-2 rounded-lg">
          Por Curso
        </button>

        <button className="bg-slate-700 px-4 py-2 rounded-lg">
          Tendencias
        </button>

      </div>
    </div>
  );
}