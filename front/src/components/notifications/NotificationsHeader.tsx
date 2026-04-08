export default function NotificationsHeader() {
  return (
    <div className="
      flex flex-col md:flex-row
      justify-between
      items-start md:items-center
      gap-4
      mb-6
    ">

      {/* LEFT */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-200 tracking-tight">
          Centro de Notificaciones
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Mantente informado sobre eventos importantes del sistema
        </p>
      </div>

      {/* RIGHT */}
      <button className="
        bg-white/5
        border border-white/10
        px-4 py-2
        rounded-xl
        text-sm
        text-gray-300
        hover:bg-white/10
        hover:text-white
        active:scale-95
        transition-all
        shadow-sm
      ">
        Marcar Todas como Leídas
      </button>

    </div>
  );
}