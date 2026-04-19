import { Download, Send, BarChart } from "lucide-react";

export default function MassOperations() {
  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-8
        rounded-[2.5rem]
        backdrop-blur-2xl
        shadow-2xl
        mt-8
        overflow-hidden
      "
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-yellow-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="mb-6 relative z-10">
        <h2 className="text-[11px] font-black text-white tracking-tight uppercase">
          Operaciones Masivas
        </h2>

        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">
          Acciones globales sobre el sistema
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 relative z-10">
        <Card
          icon={<Download size={20} />}
          title="Exportar Datos"
          description="Descargar base completa"
          variant="yellow"
        />

        <Card
          icon={<Send size={20} />}
          title="Notificaciones"
          description="Enviar avisos masivos"
          variant="green"
        />

        <Card
          icon={<BarChart size={20} />}
          title="Análisis"
          description="Comparar semestres"
          variant="yellow"
        />
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  description,
  variant = "yellow",
}: any) {
  const variants = {
    yellow:
      "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
    green:
      "bg-green-500/10 text-green-500 border border-green-500/20",
  };

  return (
    <div
      className="
        group
        bg-white/[0.02]
        border border-white/5
        p-5
        rounded-[1.8rem]
        hover:bg-white/[0.05]
        hover:border-white/20
        hover:scale-[1.04]
        transition-all duration-300
        cursor-pointer
      "
    >
      <div
        className={`
          w-12 h-12
          flex items-center justify-center
          rounded-2xl
          mb-4
          shadow-inner
          group-hover:scale-110
          transition
          ${variants[variant]}
        `}
      >
        {icon}
      </div>

      <p className="text-[11px] font-black text-white tracking-tight uppercase">
        {title}
      </p>

      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
        {description}
      </p>
    </div>
  );
}