import NotificationItem from "./NotificationItem";

export default function NotificationsList() {
  return (
    <div>

      <h2 className="mb-4 font-semibold">
        Notificaciones (8)
      </h2>

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
  );
}