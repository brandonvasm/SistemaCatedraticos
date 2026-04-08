export default function CustomReport() {
  return (
    <div className="
      bg-[#0f111a]/50
      border border-yellow-500/20
      p-6
      rounded-2xl
      backdrop-blur-2xl
      shadow-xl
      flex flex-col md:flex-row
      justify-between
      md:items-center
      gap-4
      mb-6
      hover:border-yellow-400/40
      transition-all
    ">

      <div>
        <h2 className="font-bold text-white tracking-tight">
          Generar Reporte Personalizado
        </h2>

        <p className="text-sm text-gray-500">
          Configura parámetros específicos para tu análisis
        </p>
      </div>

      <button
        className="
          bg-yellow-400/90
          text-black
          px-4 py-2
          rounded-lg
          text-sm font-semibold
          hover:bg-yellow-300
          active:scale-95
          transition-all
          shadow-md
        "
      >
        Configurar Reporte
      </button>

    </div>
  );
}