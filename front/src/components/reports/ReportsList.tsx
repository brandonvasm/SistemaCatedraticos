import ReportItem from "./ReportItem";

export default function ReportsList() {
  return (
    <div className="bg-[#1c2746] p-6 rounded-xl mb-6">

      <h2 className="mb-4 font-semibold">
        Reportes Disponibles (6)
      </h2>

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
  );
}