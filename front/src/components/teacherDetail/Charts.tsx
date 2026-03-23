export default function Charts() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">

      <div className="bg-[#1e293b] p-6 rounded-xl">
        <h2 className="mb-4">Evolución Histórica</h2>

        <div className="h-40 flex items-end gap-4">
          <div className="bg-yellow-400 w-4 h-[60%]" />
          <div className="bg-yellow-400 w-4 h-[70%]" />
          <div className="bg-yellow-400 w-4 h-[80%]" />
          <div className="bg-yellow-400 w-4 h-[90%]" />
        </div>
      </div>

      <div className="bg-[#1e293b] p-6 rounded-xl">
        <h2 className="mb-4">Evaluación por Categoría</h2>

        <div className="h-40 flex justify-center items-center">
          <div className="w-32 h-32 bg-yellow-400/30 rounded-full"></div>
        </div>
      </div>

    </div>
  );
}