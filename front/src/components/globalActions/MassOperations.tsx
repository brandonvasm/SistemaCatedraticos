import { Download, Send, BarChart } from "lucide-react";

export default function MassOperations() {
  return (
    <div className="bg-[#1c2746] p-6 rounded-xl mt-6">

      <h2 className="mb-4 font-semibold">
        Operaciones Masivas
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-[#243056] p-4 rounded-xl">
          <Download className="mb-2 text-blue-400" />
          <p>Exportar Datos Completos</p>
          <p className="text-sm text-gray-400">
            Descargar base de datos completa
          </p>
        </div>

        <div className="bg-[#243056] p-4 rounded-xl">
          <Send className="mb-2 text-blue-400" />
          <p>Enviar Notificaciones Masivas</p>
          <p className="text-sm text-gray-400">
            Notificar a docentes
          </p>
        </div>

        <div className="bg-[#243056] p-4 rounded-xl">
          <BarChart className="mb-2 text-blue-400" />
          <p>Análisis Comparativo</p>
          <p className="text-sm text-gray-400">
            Comparar semestres
          </p>
        </div>

      </div>
    </div>
  );
}