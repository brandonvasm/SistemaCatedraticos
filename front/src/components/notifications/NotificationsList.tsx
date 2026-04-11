import NotificationItem from "./NotificationItem";

export default function NotificationsList() {
  return (
    <div className="
      bg-white/[0.02]
      border border-white/10
      p-6
      rounded-[2rem]
      backdrop-blur-2xl
      shadow-2xl
    ">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
          NOTIFICACIONES
        </h2>

        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          8 ACTIVAS
        </span>
      </div>

      <div className="space-y-4">

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