export default function Tabs({ tab, setTab }: any) {

  const tabs = [
    { id: "resumen", label: "Resumen General" },
    { id: "semestres", label: "Calificación por Semestre" },
    { id: "comentarios", label: "Comentarios Estudiantes" },
    { id: "acciones", label: "Acciones Recomendadas" },
  ];

  return (
    <div className="
      w-full
      
      rounded-2xl
      p-2
      backdrop-blur-2xl
    ">

      <div className="flex gap-2 flex-wrap">

        {tabs.map((t) => {
          const isActive = tab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
                px-4 py-2
                rounded-xl
                text-xs md:text-sm
                font-semibold
                tracking-wide
                transition-all duration-300
                border

                ${isActive
                  ? "bg-yellow-400/20 text-yellow-400 border-yellow-400/30 shadow-inner"
                  : "bg-transparent text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10"
                }
              `}
            >
              {t.label}
            </button>
          );
        })}

      </div>
    </div>
  );
}