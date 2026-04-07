export default function NotificationsHeader() {
  return (
    <div className="flex justify-between items-center mb-6">

      <div>
        <h1 className="text-2xl font-bold">
          Centro de Notificaciones
        </h1>
        <p className="text-gray-400 text-sm">
          Mantente informado sobre eventos importantes del sistema
        </p>
      </div>

      <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm">
        Marcar Todas como Leídas
      </button>

    </div>
  );
}