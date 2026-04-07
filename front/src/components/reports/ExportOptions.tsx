export default function ExportOptions() {
  return (
    <div className="bg-[#1c2746] p-6 rounded-xl">

      <h2 className="mb-4 font-semibold">
        Opciones de Exportación
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-[#243056] p-4 rounded-xl">
          <p>Formato PDF</p>
          <p className="text-sm text-gray-400">
            Para presentación
          </p>
        </div>

        <div className="bg-[#243056] p-4 rounded-xl">
          <p>Formato Excel</p>
          <p className="text-sm text-gray-400">
            Para análisis
          </p>
        </div>

        <div className="bg-[#243056] p-4 rounded-xl">
          <p>Formato CSV</p>
          <p className="text-sm text-gray-400">
            Compatible con sistemas
          </p>
        </div>

      </div>
    </div>
  );
}