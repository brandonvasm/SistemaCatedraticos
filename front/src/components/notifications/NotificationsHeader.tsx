export default function NotificationsHeader() {
  return (
    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

      <div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
          NOTIFICACIONES
        </h1>

        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
          CENTRO DE ALERTAS · SISTEMA ACADÉMICO
        </p>
      </div>

      <button
        className="
          bg-white/[0.03]
          border border-white/10
          px-6 py-3
          rounded-2xl
          text-[10px]
          font-bold
          text-gray-300
          uppercase
          tracking-widest
          backdrop-blur-md
          hover:bg-white/10
          hover:border-white/20
          hover:text-white
          active:scale-95
          transition-all
        "
      >
        Marcar Todas como Leídas
      </button>

    </div>
  );
}