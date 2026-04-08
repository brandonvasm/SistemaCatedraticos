import { Download, Send, BarChart } from "lucide-react";

export default function MassOperations() {
  return (
    <div className="bg-[#0f111a]/50 border border-white/10 p-6 rounded-2xl backdrop-blur-2xl shadow-xl mt-6">

      <h2 className="mb-5 font-bold text-white tracking-tight">
        Operaciones Masivas
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <Card
          icon={<Download size={20} className="text-blue-400" />}
          title="Exportar Datos"
          description="Descargar base completa"
        />

        <Card
          icon={<Send size={20} className="text-emerald-400" />}
          title="Notificaciones"
          description="Enviar avisos masivos"
        />

        <Card
          icon={<BarChart size={20} className="text-yellow-400" />}
          title="Análisis"
          description="Comparar semestres"
        />

      </div>
    </div>
  );
}

function Card({ icon, title, description }: any) {
  return (
    <div className="
      bg-white/[0.03]
      border border-white/10
      p-4
      rounded-xl
      hover:bg-white/[0.06]
      hover:border-white/20
      transition-all duration-300
      cursor-pointer
    ">

      <div className="
        w-10 h-10
        flex items-center justify-center
        rounded-lg
        bg-white/5
        border border-white/10
        mb-3
      ">
        {icon}
      </div>

      <p className="text-white font-semibold text-sm mb-1">
        {title}
      </p>

      <p className="text-xs text-gray-500">
        {description}
      </p>

    </div>
  );
}