import { Download, Send, BarChart } from "lucide-react";

export default function MassOperations() {
  return (
    <div className="
      bg-[#0f111a]/50
      border border-white/10
      p-8
      rounded-[2.5rem]
      backdrop-blur-2xl
      shadow-2xl
      mt-8
    ">

      <div className="mb-6">
        <h2 className="
          text-sm
          font-black
          text-white
          tracking-tight
        ">
          Operaciones Masivas
        </h2>

        <p className="
          text-[11px]
          text-gray-500
          uppercase
          tracking-[0.2em]
          mt-2
        ">
          Acciones globales sobre el sistema
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">

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
      bg-white/[0.02]
      border border-white/10
      p-5
      rounded-[1.8rem]
      hover:bg-white/[0.06]
      hover:border-white/20
      transition-all duration-300
      cursor-pointer
      group
    ">

      <div className="
        w-12 h-12
        flex items-center justify-center
        rounded-2xl
        bg-white/5
        border border-white/10
        mb-4
        group-hover:scale-105
        transition-all
      ">
        {icon}
      </div>

      <p className="
        text-sm
        font-black
        text-white
        tracking-tight
      ">
        {title}
      </p>

      <p className="
        text-[11px]
        text-gray-500
        uppercase
        tracking-wide
        mt-1
      ">
        {description}
      </p>

    </div>
  );
}