import NotificationItem from "./NotificationItem";

export default function NotificationsList() {
  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[2rem]
        backdrop-blur-2xl
        shadow-2xl
        overflow-hidden
      "
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-yellow-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="mb-6 flex items-center justify-between relative z-10">
        <h2 className="text-[11px] font-black text-white uppercase tracking-widest">
          NOTIFICACIONES
        </h2>

        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          8 ACTIVAS
        </span>
      </div>

      <div className="space-y-4 relative z-10">
        <NotificationItem
          title="Evaluación Crítica Detectada"
          description="El Ing. Roberto Mejía tiene promedio bajo, requiere atención."
          time="Hace 5 minutos"
          type="warning"
        />

        <NotificationItem
          title="Excelencia Docente Alcanzada"
          description="La Dra. Ana Rodríguez obtuvo un promedio de 4.9."
          time="Hace 1 hora"
          type="success"
        />
      </div>
    </div>
  );
}