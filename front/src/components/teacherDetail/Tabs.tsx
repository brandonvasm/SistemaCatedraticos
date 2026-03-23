export default function Tabs({ tab, setTab }: any) {
  const tabs = [
    { id: "resumen", label: "Resumen General" },
    { id: "semestres", label: "Calificación por Semestre" },
    { id: "comentarios", label: "Comentarios Estudiantes" },
    { id: "acciones", label: "Acciones Recomendadas" },
  ];

  return (
    <div className="flex gap-3 mb-6 border-b border-slate-700 pb-2">

      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`px-4 py-2 rounded-lg text-sm ${
            tab === t.id
              ? "bg-yellow-400 text-black"
              : "bg-[#1c2746]"
          }`}
        >
          {t.label}
        </button>
      ))}

    </div>
  );
}