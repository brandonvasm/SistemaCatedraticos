import NotificationItem from "./NotificationItem";

export default function NotificationsList() {
  return (
    <div className="
      bg-[#0f111a]/50
      border border-white/10
      p-6
      rounded-2xl
      backdrop-blur-2xl
      shadow-xl
    ">

      <h2 className="mb-5 font-bold text-gray-200 tracking-tight">
        Notificaciones (8)
      </h2>

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