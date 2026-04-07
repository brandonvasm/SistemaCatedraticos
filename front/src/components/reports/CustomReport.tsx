export default function CustomReport() {
  return (
    <div className="bg-[#1c2746] p-6 rounded-xl border border-yellow-500/30 flex justify-between items-center mb-6">

      <div>
        <h2 className="font-semibold">
          Generar Reporte Personalizado
        </h2>
        <p className="text-sm text-gray-400">
          Configura parámetros específicos para tu reporte
        </p>
      </div>

      <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
        Configurar Reporte
      </button>
    </div>
  );
}