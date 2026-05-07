import ReportItem from "./ReportItem";

type Props = {
  filter: string;
};

export default function ReportsList({ filter }: Props) {

  const reports = [
    {
      id: 1,
      type: "docentes",
      title: "Reporte de Docentes",
      desc: "Evaluación histórica de docentes",
      endpoint: "docentes-reports",
    },
    {
      id: 2,
      type: "cursos",
      title: "Reporte de Cursos",
      desc: "Rendimiento académico por curso",
      endpoint: "cursos-reports",
    },
    {
      id: 3,
      type: "usuarios",
      title: "Reporte de Usuarios",
      desc: "Listado completo de usuarios",
      endpoint: "usuarios-reports",
    },
  ];

  const filtered =
    filter === "general"
      ? reports
      : reports.filter((r) => r.type === filter);

  return (
    <div
      className="
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[1.8rem]
        backdrop-blur-2xl
        shadow-xl
      "
    >

      <div className="divide-y divide-white/5">

        {filtered.map((r) => (
          <ReportItem
            key={r.id}
            title={r.title}
            desc={r.desc}
            date="2026-04-29"
            format="EXCEL"
            size="--"
            endpoint={r.endpoint}
          />
        ))}

      </div>
    </div>
  );
}