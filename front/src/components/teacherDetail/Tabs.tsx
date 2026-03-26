export default function Tabs({ tab, setTab }: any) {
  const tabs = [
    { id: "resumen", label: "Resumen General" },
    { id: "semestres", label: "Calificación por Semestre" },
    { id: "comentarios", label: "Comentarios Estudiantes" },
    { id: "acciones", label: "Acciones Recomendadas" },
  ];

  return (
    <div className="flex gap-3 mb-6 border-b border-white/10 pb-2">

      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`
            px-4 py-2 rounded-lg text-sm
            transition-all duration-200

            ${tab === t.id
              ? "bg-white/10 text-white border border-white/10"
              : "bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"
            }
          `}
        >
          {t.label}
        </button>
      ))}

    </div>
  );
}