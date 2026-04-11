import ReportItem from "./ReportItem";

export default function ReportsList() {
  return (
    <div
      className="
        relative
        bg-[#0f111a]/50
        border border-white/10
        p-6
        rounded-[1.8rem]
        backdrop-blur-2xl
        shadow-xl
        mb-10
        overflow-hidden
      "
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px w-10 bg-yellow-400/30" />
        <h2 className="text-sm font-black text-white uppercase tracking-tighter">
          Reportes Disponibles (6)
        </h2>
      </div>

      <div className="divide-y divide-white/5">
        <ReportItem
          title="Evaluación General - Semestre I 2026"
          desc="Reporte completo de evaluaciones docentes"
          date="2026-02-05"
          format="PDF"
          size="2.4 MB"
        />

        <ReportItem
          title="Rendimiento por Curso"
          desc="Comparativa de cursos"
          date="2026-02-04"
          format="PDF"
          size="1.9 MB"
        />

        <ReportItem
          title="Tendencias Históricas"
          desc="Evolución de métricas"
          date="2026-02-03"
          format="PDF"
          size="5.2 MB"
        />
      </div>
    </div>
  );
}