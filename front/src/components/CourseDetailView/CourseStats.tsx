export default function CourseStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat title="Secciones" value="7" />
      <Stat title="Estudiantes" value="245" />
      <Stat title="Promedio" value="4.5" />
      <Stat title="Recomendación" value="92%" />
    </div>
  );
}

function Stat({ title, value, highlight = false }: any) {
  return (
    <div className={`
bg-[#0f111a]/50
      border border-white/10
      backdrop-blur-xl
      p-4 rounded-2xl
     
    `}>
      <p className="text-xs text-gray-400">{title}</p>
      <p className={`text-xl font-bold ${highlight ? "text-yellow-400" : "text-gray-200"}`}>
        {value}
      </p>
    </div>
  );
}