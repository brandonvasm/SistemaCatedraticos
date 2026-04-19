import ReportItem from "./ReportItem";

export default function ReportsList() {
  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[1.8rem]
        backdrop-blur-2xl
        shadow-xl
        mb-10
        overflow-hidden
      "
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/[0.03] blur-[80px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="h-px w-10 bg-yellow-400/30" />
        <h2 className="text-[11px] font-black text-white uppercase tracking-tighter">
          Reportes Disponibles (6)
        </h2>
      </div>

      <div className="divide-y divide-white/5 relative z-10">
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